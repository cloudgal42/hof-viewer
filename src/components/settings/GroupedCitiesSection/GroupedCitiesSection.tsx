import { Form } from "react-bootstrap";
import {GroupedCityRow} from "./GroupedCityRow.tsx";
import {AddGroup} from "./AddGroup.tsx";
import {Fragment, useState} from "react";
import type {GroupedCityRowSetting} from "../../../interfaces/GroupedCityRowSetting.ts";

export const GroupedCitiesSection = () => {
  const [groupedCitiesRows, setGroupedCitiesRows] =
    useState<GroupedCityRowSetting[] | []>([
      {
        ungroupedCityNames: [
          {name: "Hsingang, Jing'an", isEditable: false},
          {name: "三谷市", isEditable: false},
          {name: "Linden City", isEditable: true},
        ],
        groupedCityName: "靜安市",
        translatedGroupedCityName: "Jing'an City",
        isUserCreated: false,
      },
      {
        ungroupedCityNames: [
          {name: "Germania,New Ferryport", isEditable: false},
          {name: "Germania,old Shipyard", isEditable: false},
        ],
        groupedCityName: "Germania",
        isUserCreated: false,
      },
    ]);

  function addGroupedCityEntry() {
    setGroupedCitiesRows([
      ...groupedCitiesRows,
      {
        ungroupedCityNames: [],
        groupedCityName: `GroupedCity${groupedCitiesRows.length + 1}`,
        isUserCreated: true,
      }
    ]);
  }

  function addUngroupedCityName(groupedCityName: string) {
    const copy = [...groupedCitiesRows];
    const objToModify = copy.find(city =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.ungroupedCityNames = [
        ...objToModify.ungroupedCityNames,
        {name: `City${objToModify.ungroupedCityNames.length + 1}`, isEditable: true}
      ];
    }

    setGroupedCitiesRows(copy);
  }

  function removeUngroupedCityName(groupedCityName: string, ungroupedCityName: string) {
    const copy = [...groupedCitiesRows];
    const objToModify = copy.find(city =>
      city.groupedCityName === groupedCityName
    );

    if (objToModify) {
      objToModify.ungroupedCityNames = objToModify.ungroupedCityNames.filter(entry => {
        return entry.name !== ungroupedCityName;
      });
    }

    setGroupedCitiesRows(copy);
  }

  function removeGroupedEntry(groupedCityName: string) {
    setGroupedCitiesRows(groupedCitiesRows.filter(entry => entry.groupedCityName !== groupedCityName));
  }

  return (
    <section id="groupedCities">
      <h3 className="fs-4 mb-2">Grouped Cities</h3>
      <p className="text-muted">
        Adjust or override the behavior of the screenshot grouping algorithm
      </p>
      <section className="mb-3">
        <Form.Control
          placeholder="(Optional) Enter creator name/ID for city names..."
          aria-label="(Optional) Enter creator name/ID for city names..."
        />
      </section>

      <section id="groupedCitiesSettingsEntries">
        {groupedCitiesRows.map((groupedCitiesRow, i) => (
          <Fragment key={groupedCitiesRow.groupedCityName}>
            <GroupedCityRow
              onAdd={addUngroupedCityName}
              onRemoveUngroupedName={removeUngroupedCityName}
              onRemoveGroupedName={removeGroupedEntry}
              {...groupedCitiesRow}
            />
            {i < groupedCitiesRows.length - 1 && (
              <hr/>
            )}
          </Fragment>
        ))}
        <AddGroup onAdd={addGroupedCityEntry} />
      </section>
    </section>
  );
};
