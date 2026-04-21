import { Button, Form } from "react-bootstrap";
import { GroupedCityRow } from "./GroupedCityRow.tsx";
import { AddGroup } from "./AddGroup.tsx";
import { Fragment, useRef, useState } from "react";
import type { GroupedCityRowSetting } from "../../../interfaces/GroupedCityRowSetting.ts";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import {useCreatorCities} from "../../../hooks/useCreatorCities.ts";

export const GroupedCitiesSection = () => {
  const [creator, setCreator] = useState<string>("");
  // const {data, isFetching, error} = useCreatorCities(creator);

  // () => {
  //   if (!data || !creator) return null;
  //
  //   const cityNames = data.map(({cityName}) => cityName);
  //   const uniqueCityNames = [...new Set(cityNames)];
  //
  //   const cityNamesNoCase = cityNames.map((cityName) => cityName.toLowerCase());
  //   const uniqueCityNamesIgnoreCase = [...new Set(cityNames)];
  //
  //   const list: GroupedCityRowSetting[] = uniqueCityNamesIgnoreCase.map(cityName => {
  //     const matchingNames = uniqueCityNames.filter(name => name.toLowerCase() === cityName);
  //     return {
  //       ungroupedCityNames: matchingNames.map(name => ({
  //         name: name,
  //         isEditable: false,
  //       })),
  //       groupedCityName: cityName,
  //       isUserCreated: false,
  //     }
  //   });
  //
  //   const map = new Map<string, GroupedCityRowSetting[]>();
  //   map.set(creator, list);
  //
  //   return map;
  // }

  const sampleMap = new Map<string, GroupedCityRowSetting[]>();

  sampleMap.set("foxxy", [{
    ungroupedCityNames: [
      {name: "靜安市", isEditable: false},
      {name: "Hsingang, Jing'an", isEditable: false},
      {name: "三谷市", isEditable: false},
      {name: "Linden City", isEditable: true},
    ],
    groupedCityName: "靜安市",
    translatedGroupedCityName: "Jing'an City",
    isUserCreated: false,
  }]);

  sampleMap.set("maetzger", [{
    ungroupedCityNames: [
      {name: "Germania", isEditable: false},
      {name: "Germania,New Ferryport", isEditable: false},
      {name: "Germania,old Shipyard", isEditable: false},
    ],
    groupedCityName: "Germania",
    isUserCreated: false,
  }]);

  const [groupedCitiesRows, setGroupedCitiesRows] = useState<
    Map<string, GroupedCityRowSetting[]> | null
  >(sampleMap);

  function addGroupedCityEntry() {
    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;

    if (copy && creator) {
      const creatorSettings = copy.get(creator);

      if (creatorSettings) {
        creatorSettings.push({
          ungroupedCityNames: [],
          groupedCityName: `GroupedCity${creatorSettings.length + 1}`,
          isUserCreated: true,
        });
      }
    }

    setGroupedCitiesRows(copy);
  }

  function addUngroupedCityName(groupedCityName: string) {
    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;
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

    setGroupedCitiesRows(copy);
  }

  function removeUngroupedCityName(
    groupedCityName: string,
    ungroupedCityName: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;
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

    setGroupedCitiesRows(copy);
  }

  function removeGroupedEntry(groupedCityName: string) {
    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;

    let arrToModify = copy.get(creator);

    if (arrToModify) {
      arrToModify = arrToModify.filter((entry) =>
        entry.groupedCityName !== groupedCityName
      )
      copy.set(creator, arrToModify);
    }

    setGroupedCitiesRows(copy);
  }

  function changeUngroupedEntryName(
    groupedCityName: string,
    ungroupedCityName: string,
    newValue: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;

    const objToModify = copy
      .get(creator)
      ?.find((city) => city.groupedCityName === groupedCityName)
      ?.ungroupedCityNames.find((city) => city.name === ungroupedCityName);

    if (objToModify) {
      objToModify.name = newValue;
    }

    setGroupedCitiesRows(copy);
  }

  function changeGroupedEntryName(groupedCityName: string, newValue: string) {
    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;
    const objToModify = copy.get(creator)?.find((city) =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.groupedCityName = newValue;
    }

    setGroupedCitiesRows(copy);
  }

  function handleDragEnd(e: DragEndEvent) {
    if (e.canceled) return;

    const sourceName = e.operation.source?.id;
    const targetRowName = e.operation.target?.id;

    const copy = structuredClone(groupedCitiesRows);
    if (!copy) return;

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

    setGroupedCitiesRows(copy);
  }

  function handleSetCreator(formData: FormData) {
    const submittedCreator = formData.get("creator")?.toString();
    if (!submittedCreator) return;

    setCreator(submittedCreator);
  }

  const creatorEntries = groupedCitiesRows && groupedCitiesRows.get(creator);

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
              placeholder="Enter creator name/ID..."
              aria-label="Enter creator name/ID..."
              id="creatorInput"
              name="creator"
              defaultValue={creator}
              aria-describedby="creatorInputHelpBlock"
            />
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
        <DragDropProvider
          onDragEnd={handleDragEnd}
        >
          {creatorEntries && creatorEntries.map((groupedCitiesRow, i) => (
            <Fragment key={groupedCitiesRow.groupedCityName}>
              <GroupedCityRow
                onAdd={addUngroupedCityName}
                onRemoveUngroupedName={removeUngroupedCityName}
                onRemoveGroupedName={removeGroupedEntry}
                onChangeUngroupedName={changeUngroupedEntryName}
                onChangeGroupedName={changeGroupedEntryName}
                {...groupedCitiesRow}
              />
              {i < creatorEntries.length - 1 && <hr />}
            </Fragment>
          ))}
          <AddGroup onAdd={addGroupedCityEntry} />
        </DragDropProvider>
      </section>
    </section>
  );
};
