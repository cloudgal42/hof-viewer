import {
  Accordion,
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { GroupedCityRow } from "./GroupedCityRow.tsx";
import { AddGroup } from "./AddGroup.tsx";
import { Fragment, useState } from "react";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { ErrorScreen } from "../../misc/ErrorScreen/ErrorScreen.tsx";
import { useLocalStorage } from "usehooks-ts";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";
import { useGroupedCitiesSettings } from "../../../hooks/useGroupedCitiesSettings.ts";

import type { GroupCandidate } from "../../../interfaces/GroupCandidate.ts";
import { ErrorNotification } from "../../misc/LeftNotification/ErrorNotification.tsx";
import { ToggleSetting } from "../SettingsComponents/ToggleSetting.tsx";
import {
  ArrowClockwise,
  ExclamationTriangle,
  Flask,
} from "react-bootstrap-icons";
import type { GroupedCityGenSettings } from "../../../interfaces/GroupedCityGenSettings.ts";
import { DatalistControl } from "./DatalistControl.tsx";
import {useGroupedCitiesGenSettings} from "../../../hooks/useGroupedCitiesGenSettings.ts";

export const GroupedCitiesSection = () => {
  const [creator, setCreator] = useState<string>("");
  const [settingsError, setSettingsError] = useState<
    "ROW_ALREADY_EXISTS" | "NAME_ALREADY_EXISTS" | ""
  >("");

  const [groupedCitiesGenSettings, setGroupedCitiesGenSettings] = useGroupedCitiesGenSettings();

  const {
    groupedCitiesRows,
    error,
    isFetching,
    getOriginFromGroupCandidateId,
    addGroupCandidate,
    changeGroupCandidateName,
    removeGroupCandidate,
    addGroupedCityEntry,
    changeGroupedEntryName,
    removeGroupedEntry,
    isRowAlreadyExists,
    handleChangeSettings,
    isGroupCandidateAlreadyExists,
    resetToDefault,
  } = useGroupedCitiesSettings(creator, true);

  const [currDraggedGroupedCandidate, setCurrDraggedGroupedCandidate] =
    useState<GroupCandidate | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);

  function handleDragStart(e: DragStartEvent) {
    const sourceId = e.operation.source?.id;
    const origin = sourceId && getOriginFromGroupCandidateId(
      groupedCitiesRows,
      sourceId?.toString(),
    );

    if (origin) {
      const obj = origin.groupCandidates.find((entry) => entry.id === sourceId);
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
  } else if (creatorEntries?.length === 0) {
    content = (
      <ErrorScreen
        errorSummary="This creator has not yet posted any screenshots :("
        errorDetails="Maybe try looking for another creator?"
      />
    );
  } else if (
    creatorEntriesWithGroupCandidates && creatorEntriesWithoutGroupCandidates &&
    (creatorEntriesWithGroupCandidates.length > 0 ||
      creatorEntriesWithoutGroupCandidates.length > 0) &&
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
            {creatorEntriesWithGroupCandidates.map((groupedCitiesRow) => (
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
          <Button
            className="w-100 mt-2 d-flex gap-2 align-items-center justify-content-center"
            variant="outline-danger"
            onClick={() => setModalVisible(true)}
          >
            <ArrowClockwise />
            Reset overrides to default
          </Button>
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
      <Modal
        show={isModalVisible}
        onHide={() => setModalVisible(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to reset this preset to defaults? This action is
          {" "}
          <strong>not</strong> reversible.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setModalVisible(false);
              resetToDefault();
            }}
          >
            Reset to default
          </Button>
        </Modal.Footer>
      </Modal>
      <h3 className="fs-4 mb-2">
        Grouped Cities
        <Flask title="Experimental feature" className="ms-2" />
      </h3>
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
