import { Plus, Trash } from "react-bootstrap-icons";
import { Button, Card, Form } from "react-bootstrap";
import type { GroupCandidate } from "../../../interfaces/GroupCandidate.ts";
import { DraggableEntry } from "./DraggableEntry.tsx";
import { useDroppable } from "@dnd-kit/react";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";
import { type CSSProperties, useContext } from "react";

export const GroupedCityRow = ({
  groupCandidates,
  groupedCityName,
  isUserCreated,
  id,
  style,
}: {
  groupCandidates: GroupCandidate[];
  groupedCityName: string;
  isUserCreated: boolean;
  id: string;
  style?: CSSProperties;
}) => {
  const { ref, isDropTarget } = useDroppable({
    id,
  });
  const {
    onAdd,
    onRemoveGroupedName,
    onChangeGroupedName,
  } = useContext(GroupedSettingsContext);

  return (
    <div className="mb-3" style={style}>
      <Card>
        <Card.Body>
          <Card.Title className="d-flex mb-2 gap-2 align-items-center justify-content-between">
            {isUserCreated
              ? (
                <Form.Control
                  defaultValue={groupedCityName}
                  onBlur={(e) => onChangeGroupedName(id, e.target.value)}
                />
              )
              : (
                <span className="mb-0">
                  {groupedCityName}
                </span>
              )}
            <div className="d-flex gap-2 align-items-center">
              <Button
                className="text-truncate"
                variant="outline-primary"
                onClick={() => onAdd(groupedCityName)}
              >
                <Plus className="me-1" />
                Add candidate
              </Button>
              {isUserCreated && (
                <Button
                  className="text-truncate"
                  variant="outline-danger"
                  onClick={() => onRemoveGroupedName(id)}
                >
                  <Trash />
                  <span className="visually-hidden">Delete group</span>
                </Button>
              )}
            </div>
          </Card.Title>
          <div
            ref={ref}
            className={`flex-grow-1 d-flex gap-2 flex-wrap align-items-start border border-1 border-primary rounded-2 overflow-hidden ${
              isDropTarget
                ? "border-opacity-100"
                : groupCandidates.length === 0
                ? "border-opacity-50"
                : " border-opacity-0"
            }`}
            style={groupCandidates.length === 0
              ? { "--bs-border-style": "dashed" } as CSSProperties
              : {}}
          >
            {groupCandidates.length > 0
              ? groupCandidates.map((cityName) => (
                <DraggableEntry
                  key={cityName.id}
                  id={cityName.id}
                  groupCandidate={cityName}
                  ownerId={id}
                />
              ))
              : (
                <div className={`${!isDropTarget && "text-muted"} w-100 text-center py-2`}>
                  Drag group candidates here
                </div>
              )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
