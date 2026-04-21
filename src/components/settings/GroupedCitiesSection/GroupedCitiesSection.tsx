import { Accordion, Button, Form, Spinner } from "react-bootstrap";
import { GroupedCityRow } from "./GroupedCityRow.tsx";
import { AddGroup } from "./AddGroup.tsx";
import { Fragment, useState } from "react";
import type { GroupedCityRowSetting } from "../../../interfaces/GroupedCityRowSetting.ts";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import type { City } from "../../../interfaces/City.ts";
import { useQuery } from "@tanstack/react-query";
import { ErrorScreen } from "../../misc/ErrorScreen/ErrorScreen.tsx";
import { useLocalStorage } from "usehooks-ts";

function getSettingsFromQuery(data: City[]) {
  const cityNames = data.map(({ cityName }) => cityName);
  const uniqueCityNames = [...new Set(cityNames)];

  const cityNamesNoCase = cityNames.map((cityName) => cityName.toLowerCase());
  const uniqueCityNamesIgnoreCase = [...new Set(cityNamesNoCase)];

  const list: GroupedCityRowSetting[] = uniqueCityNamesIgnoreCase.map(
    (cityName, i) => {
      const matchingNames = uniqueCityNames.filter((name) =>
        name.toLowerCase() === cityName.toLowerCase()
      );
      return {
        ungroupedCityNames: matchingNames.map((name) => ({
          name: name,
          isEditable: false,
        })),
        groupedCityName: uniqueCityNames[i],
        isUserCreated: false,
      };
    },
  );

  return list;
}

const useCreatorCitiesGroupedSettings = (
  creator: string,
  setter: (newVal: GroupedCityRowSetting[]) => void,
) => {
  return useQuery<GroupedCityRowSetting[]>({
    queryKey: ["cities", creator],
    queryFn: async () => {
      if (!creator) return [];

      const res = await fetch(
        `${import.meta.env.VITE_HOF_SERVER}/screenshots?creatorId=${creator}`,
      );
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      const creatorSettings = getSettingsFromQuery(data);
      setter(creatorSettings);
      return creatorSettings;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const GroupedCitiesSection = () => {
  const [creator, setCreator] = useState<string>("");

  const [groupedCitiesSettings, setGroupedCitiesSettings] = useLocalStorage<
    [string, GroupedCityRowSetting[]][]
  >(
    "groupedCitiesSettings",
    [],
  );
  const [groupedCitiesRows, setGroupedCitiesRows] = useState<
    Map<string, GroupedCityRowSetting[]>
  >(
    new Map<string, GroupedCityRowSetting[]>(groupedCitiesSettings),
  );

  const { isFetching, error } = useCreatorCitiesGroupedSettings(
    creator,
    (newVal: GroupedCityRowSetting[]) => {
      const copy = structuredClone(groupedCitiesRows);
      // We don't want to reset to default if there is already data in local storage
      if (groupedCitiesRows.has(creator)) {
        // 1. Get the current list of city names
        const existingData = groupedCitiesRows.get(creator);
        const existingCityNames = existingData?.map(cityName =>
          cityName.groupedCityName
        );

        // 2. Filter for new city names
        const newEntries = newVal.filter(cityName => {
          if (!existingCityNames) return false;
          return !existingCityNames.includes(cityName.groupedCityName);
        });

        // 2.2. Filter for deleted groups
        // const deletedGroups = existingData?.filter(cityName =>
        //   !newVal.includes(cityName)
        // );

        // 2.3. Filter for deleted ungrouped city names

        // 3. If there are new city names, Update with new city names
        if (newEntries.length > 0 && existingData) {
          copy.set(creator, [...existingData, ...newEntries])
        }
      } else {
        copy.set(creator, newVal);
      }

      setGroupedCitiesRows(copy);
    },
  );

  function handleChangeSettings(newMap: Map<string, GroupedCityRowSetting[]>) {
    setGroupedCitiesRows(newMap);
    setGroupedCitiesSettings(Array.from(newMap.entries()));
  }

  function addGroupedCityEntry() {
    const copy = structuredClone(groupedCitiesRows);

    if (copy && creator) {
      const creatorSettings = copy.get(creator);

      if (creatorSettings) {
        creatorSettings.push({
          ungroupedCityNames: [{
            name: `GroupedCity${creatorSettings.length + 1}-1`,
            isEditable: true,
          }],
          groupedCityName: `GroupedCity${creatorSettings.length + 1}`,
          isUserCreated: true,
        });
      }
    }

    handleChangeSettings(copy);
  }

  function addUngroupedCityName(groupedCityName: string) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.ungroupedCityNames = [
        ...objToModify.ungroupedCityNames,
        {
          name: `${objToModify.groupedCityName}-${
            objToModify.ungroupedCityNames.length + 1
          }`,
          isEditable: true,
        },
      ];
    }

    handleChangeSettings(copy);
  }

  function removeUngroupedCityName(
    groupedCityName: string,
    ungroupedCityName: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.ungroupedCityNames = objToModify.ungroupedCityNames.filter(
        (entry) => {
          return entry.name !== ungroupedCityName;
        },
      );
    }

    handleChangeSettings(copy);
  }

  function removeGroupedEntry(groupedCityName: string) {
    const copy = structuredClone(groupedCitiesRows);

    let arrToModify = copy.get(creator);

    if (arrToModify) {
      arrToModify = arrToModify.filter((entry) =>
        entry.groupedCityName !== groupedCityName
      );
      copy.set(creator, arrToModify);
    }

    handleChangeSettings(copy);
  }

  function changeUngroupedEntryName(
    groupedCityName: string,
    ungroupedCityName: string,
    newValue: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy
      .get(creator)
      ?.find((city) => city.groupedCityName === groupedCityName)
      ?.ungroupedCityNames.find((city) => city.name === ungroupedCityName);

    if (objToModify) {
      objToModify.name = newValue;
    }

    handleChangeSettings(copy);
  }

  function changeGroupedEntryName(groupedCityName: string, newValue: string) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.groupedCityName = newValue;
    }

    handleChangeSettings(copy);
  }

  function handleDragEnd(e: DragEndEvent) {
    if (e.canceled) return;

    const sourceName = e.operation.source?.id;
    const targetRowName = e.operation.target?.id;

    const copy = structuredClone(groupedCitiesRows);

    const origin = copy.get(creator)?.find((entry) => {
      return entry.ungroupedCityNames.some((cityName) =>
        cityName.name === sourceName
      );
    });
    const target = copy.get(creator)?.find((entry) =>
      entry.groupedCityName === targetRowName
    );

    if (origin && target && sourceName && targetRowName) {
      const objToMove = origin.ungroupedCityNames.find((entry) =>
        entry.name === sourceName
      );

      if (objToMove) {
        origin.ungroupedCityNames = origin.ungroupedCityNames.filter((entry) =>
          entry.name !== sourceName
        );
        target.ungroupedCityNames = [...target.ungroupedCityNames, objToMove];
      }
    } else if (origin && targetRowName === "addGroup") {
      const objToMove = origin.ungroupedCityNames.find((entry) =>
        entry.name === sourceName
      );

      if (objToMove) {
        origin.ungroupedCityNames = origin.ungroupedCityNames.filter((entry) =>
          entry.name !== sourceName
        );
        // Initiate a new row with that value
        const creatorEntries = copy.get(creator);
        if (!creatorEntries) return;

        creatorEntries.push({
          ungroupedCityNames: [objToMove],
          groupedCityName: objToMove.name,
          isUserCreated: true,
        });
      }
    }

    handleChangeSettings(copy);
  }

  function handleSetCreator(formData: FormData) {
    const submittedCreator = formData.get("creator")?.toString() || "";
    setCreator(submittedCreator);
  }

  const creatorEntries = groupedCitiesRows && groupedCitiesRows
    .get(creator)
    ?.sort((a, b) => b.ungroupedCityNames.length - a.ungroupedCityNames.length);

  const creatorEntriesWithUngroupedNames = creatorEntries &&
    creatorEntries.filter((entry) => entry.ungroupedCityNames.length > 0);
  const creatorEntriesWithoutUngroupedNames = creatorEntries &&
    creatorEntries.filter((entry) => entry.ungroupedCityNames.length === 0);

  let content;

  if (isFetching) {
    content = (
      <div className="w-100 py-5 my-5 d-flex align-items-center justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    content = (
      <ErrorScreen
        errorSummary="Failed to get this creator's cities :("
        errorDetails={error.message}
      />
    );
  } else if (
    creatorEntriesWithUngroupedNames && creatorEntriesWithoutUngroupedNames
  ) {
    content = (
      <DragDropProvider
        onDragEnd={handleDragEnd}
      >
        {creatorEntriesWithUngroupedNames.map((groupedCitiesRow, i) => (
          <Fragment key={groupedCitiesRow.groupedCityName}>
            <GroupedCityRow
              onAdd={addUngroupedCityName}
              onRemoveUngroupedName={removeUngroupedCityName}
              onRemoveGroupedName={removeGroupedEntry}
              onChangeUngroupedName={changeUngroupedEntryName}
              onChangeGroupedName={changeGroupedEntryName}
              {...groupedCitiesRow}
            />
            {i < creatorEntriesWithUngroupedNames.length - 1 && <hr />}
          </Fragment>
        ))}
        {creatorEntriesWithoutUngroupedNames.length > 0 && (
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Grouped city names with 0 group candidates
                ({creatorEntriesWithoutUngroupedNames.length} result(s))
              </Accordion.Header>
              <Accordion.Body>
                {creatorEntriesWithoutUngroupedNames.map((
                  groupedCitiesRow,
                  i,
                ) => (
                  <Fragment key={groupedCitiesRow.groupedCityName}>
                    <GroupedCityRow
                      onAdd={addUngroupedCityName}
                      onRemoveUngroupedName={removeUngroupedCityName}
                      onRemoveGroupedName={removeGroupedEntry}
                      onChangeUngroupedName={changeUngroupedEntryName}
                      onChangeGroupedName={changeGroupedEntryName}
                      {...groupedCitiesRow}
                    />
                    {i < creatorEntriesWithoutUngroupedNames.length - 1 && (
                      <hr />
                    )}
                  </Fragment>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
        <AddGroup onAdd={addGroupedCityEntry} />
      </DragDropProvider>
    );
  }

  return (
    <section id="groupedCities">
      <h3 className="fs-4 mb-2">Grouped Cities</h3>
      <p className="text-muted">
        Adjust or override the behavior of the screenshot grouping algorithm
      </p>
      <section className="mb-3">
        <form
          className="d-flex gap-2 align-items-start"
          action={handleSetCreator}
        >
          <div className="w-100">
            <Form.Control
              type="text"
              placeholder="Enter new or creator name/ID with existing settings..."
              aria-label="Enter new or creator name/ID with existing settings..."
              id="creatorInput"
              name="creator"
              defaultValue={creator}
              aria-describedby="creatorInputHelpBlock"
              list="creatorsWithPresets"
            />
            <datalist id="creatorsWithPresets">
              {groupedCitiesRows &&
                [...groupedCitiesRows.keys()].map((creator) => (
                  <option key={creator} value={creator} />
                ))}
            </datalist>
            <Form.Text id="creatorInputHelpBlock">
              Each creator is associated with a specific configuration preset.
            </Form.Text>
          </div>
          <Button type="submit">
            Submit
          </Button>
        </form>
      </section>

      <section id="groupedCitiesSettingsEntries">
        {content}
      </section>
    </section>
  );
};
