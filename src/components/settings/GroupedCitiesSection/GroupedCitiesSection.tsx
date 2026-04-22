import {Accordion, Button, Form, Spinner} from "react-bootstrap";
import { GroupedCityRow } from "./GroupedCityRow.tsx";
import { AddGroup } from "./AddGroup.tsx";
import { Fragment, useState } from "react";
import type { GroupedCityRowSetting } from "../../../interfaces/GroupedCityRowSetting.ts";
import {DragDropProvider, type DragEndEvent, type DragStartEvent} from "@dnd-kit/react";
import { ErrorScreen } from "../../misc/ErrorScreen/ErrorScreen.tsx";
import { useLocalStorage } from "usehooks-ts";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";
import { useCreatorInitialGroupedSettings } from "../../../hooks/useCreatorInitialGroupedSettings.ts";

import "../../../css/components/GroupedCitiesSection.css";
import type {UngroupedCityName} from "../../../interfaces/UngroupedCityName.ts";
import {ErrorNotification} from "../../misc/LeftNotification/ErrorNotification.tsx";

export const GroupedCitiesSection = () => {
  const [creator, setCreator] = useState<string>("");
  const [settingsError, setSettingsError] = useState<
    "ROW_ALREADY_EXISTS" | "NAME_ALREADY_EXISTS" | ""
  >("");

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

  const [currDraggedGroupedCandidate, setCurrDraggedGroupedCandidate] =
    useState<UngroupedCityName | null>(null);

  // Fetches data than check if data needs to be created or updated.
  // Than updates the state via a cb
  const { isFetching, error } = useCreatorInitialGroupedSettings(
    creator,
    (newVal: GroupedCityRowSetting[]) => {
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
        const newEntries = newVal.filter((cityName) => {
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
          valToSet = [...existingData, ...newEntries];
        } else if (existingData) {
          valToSet = [...existingData];
        }
      } else {
        valToSet = [...newVal];
      }

      if (valToSet) {
        console.log("Sorting");
        valToSet = valToSet.sort((a, b) => b.ungroupedCityNames.length - a.ungroupedCityNames.length);
        copy.set(creator, valToSet);
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
          id: crypto.randomUUID(),
        },
      ];
    }

    handleChangeSettings(copy);
  }

  function removeUngroupedCityName(
    ownerId: string,
    id: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);

    const objToModify = copy.get(creator)?.find((city) => city.id === ownerId);

    if (objToModify) {
      objToModify.ungroupedCityNames = objToModify.ungroupedCityNames.filter(
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

  function changeUngroupedEntryName(
    ownerId: string,
    ungroupedCityId: string,
    newValue: string,
  ) {
    const copy = structuredClone(groupedCitiesRows);
    const objToModify = copy
      .get(creator)
      ?.find((city) => city.id === ownerId)
      ?.ungroupedCityNames.find((city) => city.id === ungroupedCityId);

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

  function getOriginFromUngroupedNameId(
    copy: Map<string, GroupedCityRowSetting[]>,
    id: string
  ) {
    return copy.get(creator)?.find((entry) => {
      return entry.ungroupedCityNames.some((cityName) =>
        cityName.id === id
      );
    });
  }

  function handleDragStart(e: DragStartEvent) {
    const sourceId = e.operation.source?.id;
    const origin = sourceId && getOriginFromUngroupedNameId(
      groupedCitiesRows, sourceId?.toString()
    );

    if (origin) {
      const obj = origin.ungroupedCityNames.find((entry) =>
        entry.id === sourceId
      );
      if (obj) setCurrDraggedGroupedCandidate(obj);
    }
    setSettingsError("");
  }

  function handleDragEnd(e: DragEndEvent) {
    if (e.canceled || !e.operation.source?.id) return;

    const sourceId = e.operation.source?.id;
    const targetRowId = e.operation.target?.id;

    const copy = structuredClone(groupedCitiesRows);
    const origin = getOriginFromUngroupedNameId(copy, sourceId?.toString());
    const target = copy.get(creator)?.find((entry) => entry.id === targetRowId);

    // Check if the name is moved to another section
    if (origin && target && sourceId && targetRowId) {
      const objToMove = origin.ungroupedCityNames.find((entry) =>
        entry.id === sourceId
      );

      if (objToMove) {
        origin.ungroupedCityNames = origin.ungroupedCityNames.filter((entry) =>
          entry.id !== sourceId
        );
        target.ungroupedCityNames = [...target.ungroupedCityNames, objToMove];
      }
    } else if (origin && targetRowId === "addGroup") {
      const objToMove = origin.ungroupedCityNames.find((entry) =>
        entry.id === sourceId
      );
      const isRowAlreadyExists = copy.get(creator)?.some((entry) =>
        entry.groupedCityName === objToMove?.name
      );

      if (isRowAlreadyExists) {
        setSettingsError("ROW_ALREADY_EXISTS");
        return;
      }

      if (objToMove && !isRowAlreadyExists) {
        origin.ungroupedCityNames = origin.ungroupedCityNames.filter((entry) =>
          entry.id !== sourceId
        );
        // Initiate a new row with that value
        const creatorEntries = copy.get(creator);
        if (!creatorEntries) return;

        creatorEntries.push({
          ungroupedCityNames: [objToMove],
          groupedCityName: objToMove.name,
          isUserCreated: true,
          id: crypto.randomUUID(),
        });
      }
    }

    handleChangeSettings(copy);
    setSettingsError("");
    setCurrDraggedGroupedCandidate(null);
  }

  function handleSetCreator(formData: FormData) {
    const submittedCreator = formData.get("creator")?.toString() || "";
    setCreator(submittedCreator);
  }

  function isUngroupedNameAlreadyExists(
    parentId: string,
    id: string,
    name: string,
  ) {
    // 1. Get all creator entries
    const creatorEntries = groupedCitiesRows.get(creator);

    if (!creatorEntries) return false;

    // 2. Map all of them to the following data struct:
    // {
    //   ungroupedName: string
    //   parentId: string
    //   id: string
    // }
    const processed = creatorEntries.flatMap((entry) => {
      return entry.ungroupedCityNames.map((groupedCandidates) => ({
        ungroupedName: groupedCandidates.name,
        parentId: entry.id,
        id: groupedCandidates.id,
      }));
    });

    console.log(processed);

    // 3. Check if:
    // ungroupedName exists in whole list. If yes, return entries that match this
    // AND if those returned results have different ID compared to id
    // OR if those returned results have a diff parent ID
    const duplicatedNameEntries = processed
      .filter((nameEntries) => nameEntries.ungroupedName === name);

    if (duplicatedNameEntries.length < 1) return false;

    return duplicatedNameEntries
      .some((nameEntries) =>
        nameEntries.id !== id ||
        nameEntries.parentId !== parentId
      );
  }

  const creatorEntries = groupedCitiesRows && groupedCitiesRows.get(creator);

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
      <GroupedSettingsContext
        value={{
          onAdd: addUngroupedCityName,
          onRemoveUngroupedName: removeUngroupedCityName,
          onRemoveGroupedName: removeGroupedEntry,
          onChangeGroupedName: changeGroupedEntryName,
          onChangeUngroupedName: changeUngroupedEntryName,
          isUngroupedNameAlreadyExists,
        }}
      >
        <DragDropProvider
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-auto grouped-settings-form" style={{scrollbarGutter: "stable"}}>
            {creatorEntriesWithUngroupedNames.map((groupedCitiesRow, i) => (
              <Fragment key={groupedCitiesRow.id}>
                <GroupedCityRow {...groupedCitiesRow} style={{minWidth: "500px"}} />
                {i < creatorEntriesWithUngroupedNames.length - 1 && <hr style={{minWidth: "500px"}} />}
              </Fragment>
            ))}
            {creatorEntriesWithoutUngroupedNames.length > 0 && (
              <Accordion style={{minWidth: "500px"}}>
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
                      <Fragment key={groupedCitiesRow.id}>
                        <GroupedCityRow {...groupedCitiesRow} />
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
          </div>
        </DragDropProvider>
      </GroupedSettingsContext>
    );
  }

  return (
    <section id="groupedCities">
      {settingsError === "ROW_ALREADY_EXISTS"
        ? (
          <ErrorNotification>
            Cannot add "{currDraggedGroupedCandidate?.name}" because such group already exists.
          </ErrorNotification>
        )
        : settingsError === "NAME_ALREADY_EXISTS" && (
          <ErrorNotification>
            This city name already exists. Please specify a different name.
          </ErrorNotification>
        )}
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
