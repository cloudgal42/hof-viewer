import type {City} from "../interfaces/City.ts";
import type {GroupedCityRowSetting} from "../interfaces/GroupedCityRowSetting.ts";
import {useQuery} from "@tanstack/react-query";
import {useLocalStorage} from "usehooks-ts";
import {useRef} from "react";
import {getUniqueCityNameProperties} from "../utils/UniqueCityNameProperties.ts";
import type {CityNameProperties} from "../interfaces/CityNameProperties.ts";

function getSettingsFromQuery(data: City[]) {
  const cityNames: CityNameProperties[] = data.map((entry) => ({
    cityName: entry.cityName,
    cityNameTranslated: entry.cityNameTranslated,
    cityNameLatinized: entry.cityNameLatinized,
  }));
  const uniqueCityNames = getUniqueCityNameProperties(cityNames);

  const cityNamesNoCase: CityNameProperties[] = cityNames.map((entry) => ({
    cityName: entry.cityName.toLowerCase(),
    cityNameTranslated: entry.cityNameTranslated,
    cityNameLatinized: entry.cityNameLatinized,
  }));
  const uniqueCityNamesIgnoreCase = getUniqueCityNameProperties(cityNamesNoCase);

  const list: GroupedCityRowSetting[] = uniqueCityNamesIgnoreCase.map(
    (entry, i) => {
      const matchingNames = uniqueCityNames.filter((subEntry) =>
        subEntry.cityName.toLowerCase() === entry.cityName.toLowerCase()
      );
      return {
        groupCandidates: matchingNames.map((candidate) => ({
          name: candidate.cityName,
          isEditable: false,
          id: crypto.randomUUID(),
        })),
        groupedCityName: uniqueCityNames[i].cityName,
        translatedGroupedCityName: uniqueCityNames[i].cityNameTranslated,
        latinizedGroupedCityName: uniqueCityNames[i].cityNameLatinized,
        isUserCreated: false,
        id: crypto.randomUUID(),
      };
    },
  );

  return list;
}

// TODO: Make this avoid creation of new settings by default (with option to override)
export const useGroupedCitiesSettings = (
  creator: string,
  fetchNewSettings?: boolean
) => {
  const [groupedCitiesOverride, setGroupedCitiesOverride] = useLocalStorage<
    [string, GroupedCityRowSetting[]][]
  >(
    "groupedCitiesOverride",
    [],
  );
  const groupedCitiesRows = new Map<string, GroupedCityRowSetting[]>(
    groupedCitiesOverride,
  );

  const defaultSettingsRef = useRef<GroupedCityRowSetting[]>([]);

  const queryObjs = useQuery<GroupedCityRowSetting[]>({
    queryKey: ["groupedCityRowSetting", creator],
    queryFn: async () => {
      if (!creator) return [];

      const res = await fetch(
        `${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}`,
      );
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      const defaultSettings = getSettingsFromQuery(data);
      console.log(defaultSettings);
      defaultSettingsRef.current = defaultSettings;

      const copy = structuredClone(groupedCitiesRows);
      let valToSet: GroupedCityRowSetting[] | null = null;
      // We don't want to reset to default if there is already data in local storage
      if (groupedCitiesRows.has(creator)) {
        // 1. Get the current list of city names
        const existingData = groupedCitiesRows.get(creator);
        const existingCityNames = existingData?.map((cityName) =>
          cityName.groupedCityName
        );

        // 2. Filter for new city names
        const newEntries = defaultSettings.filter((cityName) => {
          if (!existingCityNames) return false;
          return !existingCityNames.includes(cityName.groupedCityName);
        });

        // TODO
        // 2.2. Filter for deleted groups
        // const deletedGroups = existingData?.filter(cityName =>
        //   !newVal.includes(cityName)
        // );

        // 2.3. Filter for deleted group candidates

        // 3. If there are new city names, Update with new city names
        if (newEntries.length > 0 && existingData) {
          valToSet = [...existingData, ...newEntries];
        } else if (existingData) {
          valToSet = [...existingData];
        }
      } else {
        valToSet = [...defaultSettings];
      }

      if (valToSet) {
        console.log("Sorting");
        valToSet = valToSet.sort((a, b) =>
          b.groupCandidates.length - a.groupCandidates.length
        );
        copy.set(creator, valToSet);
      }
      setGroupedCitiesOverride(Array.from(copy.entries()));
      return defaultSettings;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: typeof fetchNewSettings !== "undefined" ? fetchNewSettings : false,
    retry: false,
  });

  function isRowAlreadyExists(name: string) {
    const creatorEntries = groupedCitiesRows.get(creator);

    if (!creatorEntries) return false;

    return creatorEntries.some((entry) => entry.groupedCityName === name);
  }

  function handleChangeSettings(newMap: Map<string, GroupedCityRowSetting[]>) {
    setGroupedCitiesOverride(Array.from(newMap.entries()));
  }

  function addGroupedCityEntry(newPosition: "top" | "bottom") {
    const copy = structuredClone(groupedCitiesRows);

    if (copy && creator) {
      const creatorSettings = copy.get(creator);

      if (creatorSettings && newPosition === "top") {
        creatorSettings.unshift({
          groupCandidates: [{
            name: `GroupedCity${creatorSettings.length + 1}-1`,
            isEditable: true,
            id: crypto.randomUUID(),
          }],
          groupedCityName: `GroupedCity${creatorSettings.length + 1}`,
          isUserCreated: true,
          id: crypto.randomUUID(),
        });
      } else if (creatorSettings) {
        creatorSettings.push({
          groupCandidates: [{
            name: `GroupedCity${creatorSettings.length + 1}-1`,
            isEditable: true,
            id: crypto.randomUUID(),
          }],
          groupedCityName: `GroupedCity${creatorSettings.length + 1}`,
          isUserCreated: true,
          id: crypto.randomUUID(),
        });
      }
    }

    handleChangeSettings(copy);
  }

  function addGroupCandidate(groupedCityName: string) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.groupCandidates = [
        {
          name: `${objToModify.groupedCityName}-${
            objToModify.groupCandidates.length + 1
          }`,
          isEditable: true,
          id: crypto.randomUUID(),
        },
        ...objToModify.groupCandidates,
      ];
    }

    handleChangeSettings(copy);
  }

  function removeGroupCandidate(
    ownerId: string,
    id: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) => city.id === ownerId);

    if (objToModify) {
      objToModify.groupCandidates = objToModify.groupCandidates.filter(
        (entry) => {
          return entry.id !== id;
        },
      );
    }

    handleChangeSettings(copy);
  }

  function removeGroupedEntry(id: string) {
    const copy = structuredClone(groupedCitiesRows);

    let arrToModify = copy.get(creator);

    if (arrToModify) {
      arrToModify = arrToModify.filter((entry) => entry.id !== id);
      copy.set(creator, arrToModify);
    }

    handleChangeSettings(copy);
  }

  function changeGroupCandidateName(
    ownerId: string,
    groupCandidateId: string,
    newValue: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);
    const objToModify = copy
      .get(creator)
      ?.find((city) => city.id === ownerId)
      ?.groupCandidates.find((city) => city.id === groupCandidateId);

    if (objToModify) {
      objToModify.name = newValue;
    }

    handleChangeSettings(copy);
  }

  function changeGroupedEntryName(id: string, newValue: string) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) => city.id === id);

    if (objToModify) {
      objToModify.groupedCityName = newValue;
    }

    handleChangeSettings(copy);
  }

  function getOriginFromGroupCandidateId(
    copy: Map<string, GroupedCityRowSetting[]>,
    id: string,
  ) {
    return copy.get(creator)?.find((entry) => {
      return entry.groupCandidates.some((cityName) => cityName.id === id);
    });
  }

  function isGroupCandidateAlreadyExists(
    parentId: string,
    id: string,
    name: string,
  ) {
    // 1. Get all creator entries
    const creatorEntries = groupedCitiesRows.get(creator);

    if (!creatorEntries) return false;

    // 2. Map all of them to the following data struct:
    // {
    //   groupCandidate: string
    //   parentId: string
    //   id: string
    // }
    const processed = creatorEntries.flatMap((entry) => {
      return entry.groupCandidates.map((groupedCandidates) => ({
        groupCandidate: groupedCandidates.name,
        parentId: entry.id,
        id: groupedCandidates.id,
      }));
    });

    console.log(processed);

    // 3. Check if:
    // groupCandidate exists in whole list. If yes, return entries that match this
    // AND if those returned results have different ID compared to id
    // OR if those returned results have a diff parent ID
    const duplicatedNameEntries = processed
      .filter((nameEntries) => nameEntries.groupCandidate === name);

    if (duplicatedNameEntries.length < 1) return false;

    return duplicatedNameEntries
      .some((nameEntries) =>
        nameEntries.id !== id ||
        nameEntries.parentId !== parentId
      );
  }

  function resetToDefault() {
    const copy = structuredClone(groupedCitiesRows);

    copy.set(creator, defaultSettingsRef.current);
    handleChangeSettings(copy);
  }

  return {
    isRowAlreadyExists,
    addGroupCandidate,
    changeGroupCandidateName,
    removeGroupCandidate,
    addGroupedCityEntry,
    changeGroupedEntryName,
    removeGroupedEntry,
    getOriginFromGroupCandidateId,
    isGroupCandidateAlreadyExists,
    handleChangeSettings,
    resetToDefault,
    ...queryObjs,
    groupedCitiesRows,
  };
};