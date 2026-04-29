import { Accordion, Alert, Form, Spinner } from "react-bootstrap";
import { GroupedCityRow } from "./GroupedCityRow.tsx";
import { AddGroup } from "./AddGroup.tsx";
import { Fragment, useState } from "react";
import type { GroupedCityRowSetting } from "../../../interfaces/GroupedCityRowSetting.ts";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { ErrorScreen } from "../../misc/ErrorScreen/ErrorScreen.tsx";
import { useLocalStorage } from "usehooks-ts";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";
import { useCreatorInitialGroupedSettings } from "../../../hooks/useCreatorInitialGroupedSettings.ts";

import type { GroupCandidate } from "../../../interfaces/GroupCandidate.ts";
import { ErrorNotification } from "../../misc/LeftNotification/ErrorNotification.tsx";
import { ToggleSetting } from "../SettingsComponents/ToggleSetting.tsx";
import { ExclamationTriangle } from "react-bootstrap-icons";
import type { GroupedCityGenSettings } from "../../../interfaces/GroupedCityGenSettings.ts";
import { DatalistControl } from "./DatalistControl.tsx";

export const GroupedCitiesSection = () => {
  const [creator, setCreator] = useState<string>("");
  const [settingsError, setSettingsError] = useState<
    "ROW_ALREADY_EXISTS" | "NAME_ALREADY_EXISTS" | ""
  >("");

  const [groupedCitiesOverride, setGroupedCitiesOverride] = useLocalStorage<
    [string, GroupedCityRowSetting[]][]
  >(
    "groupedCitiesOverride",
    [],
  );

  const [groupedCitiesGenSettings, setGroupedCitiesGenSettings] =
    useLocalStorage<GroupedCityGenSettings>(
      "groupedCitiesGenSettings",
      {
        useDefault: true,
        shareSettings: true,
      },
    );

  const groupedCitiesRows = new Map<string, GroupedCityRowSetting[]>(
    groupedCitiesOverride,
  );

  const [currDraggedGroupedCandidate, setCurrDraggedGroupedCandidate] =
    useState<GroupCandidate | null>(null);

  function isRowAlreadyExists(name: string) {
    const creatorEntries = groupedCitiesRows.get(creator);

    if (!creatorEntries) return false;

    return creatorEntries.some((entry) => entry.groupedCityName === name);
  }

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

        // 2.3. Filter for deleted group candidates

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
        valToSet = valToSet.sort((a, b) =>
          b.groupCandidates.length - a.groupCandidates.length
        );
        copy.set(creator, valToSet);
      }
      setGroupedCitiesOverride(Array.from(copy.entries()));
    },
  );

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

  function handleDragStart(e: DragStartEvent) {
    const sourceId = e.operation.source?.id;
    const origin = sourceId && getOriginFromGroupCandidateId(
      groupedCitiesRows,
      sourceId?.toString(),
    );

    if (origin) {
      const obj = origin.groupCandidates.find((entry) =>
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
    const origin = getOriginFromGroupCandidateId(copy, sourceId?.toString());
    const target = copy.get(creator)?.find((entry) => entry.id === targetRowId);

    // Check if the name is moved to another section
    if (origin && target && sourceId && targetRowId) {
      const objToMove = origin.groupCandidates.find((entry) =>
        entry.id === sourceId
      );

      if (objToMove) {
        origin.groupCandidates = origin.groupCandidates.filter((entry) =>
          entry.id !== sourceId
        );
        target.groupCandidates = [...target.groupCandidates, objToMove];
      }
    } else if (
      origin && targetRowId &&
      ["addGroupbottom", "addGrouptop"].includes(targetRowId.toString())
    ) {
      const objToMove = origin.groupCandidates.find((entry) =>
        entry.id === sourceId
      );

      const isInvalid = isRowAlreadyExists(objToMove?.name || "");

      if (isInvalid) {
        setSettingsError("ROW_ALREADY_EXISTS");
        return;
      }

      if (objToMove && !isInvalid) {
        origin.groupCandidates = origin.groupCandidates.filter((entry) =>
          entry.id !== sourceId
        );
        // Initiate a new row with that value
        const creatorEntries = copy.get(creator);
        if (!creatorEntries) return;

        if (targetRowId === "addGrouptop") {
          creatorEntries.unshift({
            groupCandidates: [objToMove],
            groupedCityName: objToMove.name,
            isUserCreated: true,
            id: crypto.randomUUID(),
          });
        } else {
          creatorEntries.push({
            groupCandidates: [objToMove],
            groupedCityName: objToMove.name,
            isUserCreated: true,
            id: crypto.randomUUID(),
          });
        }
      }
    }

    handleChangeSettings(copy);
    setSettingsError("");
    setCurrDraggedGroupedCandidate(null);
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

  const creatorEntries = groupedCitiesRows && groupedCitiesRows.get(creator);

  const creatorEntriesWithGroupCandidates = creatorEntries &&
    creatorEntries.filter((entry) => entry.groupCandidates.length > 0);
  const creatorEntriesWithoutGroupCandidates = creatorEntries &&
    creatorEntries.filter((entry) => entry.groupCandidates.length === 0);

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
    creatorEntriesWithGroupCandidates && creatorEntriesWithoutGroupCandidates &&
    !groupedCitiesGenSettings.useDefault
  ) {
    content = (
      <GroupedSettingsContext
        value={{
          onAdd: addGroupCandidate,
          onRemoveGroupCandidate: removeGroupCandidate,
          onRemoveGroupedName: removeGroupedEntry,
          onChangeGroupedName: changeGroupedEntryName,
          onChangeGroupCandidate: changeGroupCandidateName,
          isGroupCandidateAlreadyExists,
          isRowAlreadyExists,
        }}
      >
        <DragDropProvider
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <AddGroup
            onAdd={addGroupedCityEntry}
            currCandidate={currDraggedGroupedCandidate}
            position="top"
          />
          <div className="mt-3">
            {creatorEntriesWithGroupCandidates.map((groupedCitiesRow, i) => (
              <GroupedCityRow key={groupedCitiesRow.id} {...groupedCitiesRow} />
            ))}
            {creatorEntriesWithoutGroupCandidates.length > 0 && (
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Grouped city names with 0 group candidates
                    ({creatorEntriesWithoutGroupCandidates.length} result(s))
                  </Accordion.Header>
                  <Accordion.Body>
                    {creatorEntriesWithoutGroupCandidates.map((
                      groupedCitiesRow,
                      i,
                    ) => (
                      <Fragment key={groupedCitiesRow.id}>
                        <GroupedCityRow {...groupedCitiesRow} />
                      </Fragment>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
          </div>
          <AddGroup
            onAdd={addGroupedCityEntry}
            currCandidate={currDraggedGroupedCandidate}
            position="bottom"
          />
        </DragDropProvider>
      </GroupedSettingsContext>
    );
  }

  return (
    <section id="groupedCities">
      {settingsError === "ROW_ALREADY_EXISTS"
        ? (
          <ErrorNotification>
            Cannot add "{currDraggedGroupedCandidate?.name}" because such group
            already exists.
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
        <ToggleSetting
          label="Use default grouping behavior"
          id="defaultGroup"
          name="defaultGroup"
          helpBlock="Groups city names by full name, ignoring case. If this is disabled, default settings would still be used unless an override preset is created for a creator."
          onChange={(e) =>
            setGroupedCitiesGenSettings({
              useDefault: e.currentTarget.checked,
              shareSettings: groupedCitiesGenSettings.shareSettings,
            })}
          checked={groupedCitiesGenSettings.useDefault}
        />
        <ToggleSetting
          label="Share grouped cities override"
          id="shareGroupedSettings"
          name="shareGroupedSettings"
          helpBlock="Appends the custom grouped cities settings to the URL when sharing a grouped city. May result in very long URLs."
          onChange={(e) =>
            setGroupedCitiesGenSettings({
              useDefault: groupedCitiesGenSettings.useDefault,
              shareSettings: e.currentTarget.checked,
            })}
          checked={groupedCitiesGenSettings.shareSettings}
          disabled={groupedCitiesGenSettings.useDefault}
        />
        <Alert
          variant="warning"
          show={!groupedCitiesGenSettings.shareSettings &&
            !groupedCitiesGenSettings.useDefault}
        >
          <ExclamationTriangle className="me-2" />
          If there are grouped city override(s), other users and embed{" "}
          <strong>will not be able to</strong>{" "}
          see the same screenshots in a grouped city as you. If that is
          undesirable, enable <i>Share grouped cities override</i>.
        </Alert>
      </section>
      <section className="mb-3">
        <fieldset
          className={groupedCitiesGenSettings.useDefault ? "opacity-50" : ""}
          disabled={groupedCitiesGenSettings.useDefault}
        >
          <div className="w-100 mb-2">
            <legend className="fs-6 mb-0 fw-bold">
              Manual override settings
            </legend>
            <Form.Text className="d-inline-block mt-0 lh-2">
              Override the grouped cities behavior. Each creator is associated
              with a different override preset.
            </Form.Text>
          </div>
          <div className="w-100 d-flex align-items-center gap-2">
            <DatalistControl
              placeholder="Enter or select creator ID..."
              label="Enter or select creator ID..."
              id="creatorInput"
              name="creator"
              defaultValue={creator}
              optionsList={groupedCitiesRows && [...groupedCitiesRows.keys()]}
              onValueSubmit={setCreator}
              newValueHint="Create override preset for"
              tipHint="A new preset can be created by typing a new creator ID."
            >
            </DatalistControl>
          </div>
        </fieldset>
      </section>

      <section id="groupedCitiesSettingsEntries">
        {content}
      </section>
    </section>
  );
};
