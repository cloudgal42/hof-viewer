import { ArrowRight, Plus, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import { DraggableEntry } from "./DraggableEntry.tsx";
import { useDroppable } from "@dnd-kit/react";
import {GroupedSettingsContext} from "../../../context/GroupedSettingsContext.ts";
import {type CSSProperties, useContext} from "react";

export const GroupedCityRow = ({
  ungroupedCityNames,
  groupedCityName,
  translatedGroupedCityName,
  isUserCreated,
  id,
  style,
}: {
  ungroupedCityNames: UngroupedCityName[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
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
    <div className="row mb-3" style={style}>
      <div className="col-7 col-sm-6 pe-0 d-flex gap-2 align-items-center">
        <div
          className={`flex-grow-1 border border-primary border-2 rounded-2 overflow-hidden ${isDropTarget ? "border-opacity-50" : "border-opacity-0"}`}
          ref={ref}
        >
          {ungroupedCityNames.map((cityName) => (
            <DraggableEntry
              key={cityName.id}
              id={cityName.id}
              cityName={cityName}
              groupedCityName={groupedCityName}
              ownerId={id}
            />
          ))}
          <Button
            className="w-100 text-truncate"
            variant="outline-primary"
            onClick={() => onAdd(groupedCityName)}
          >
            <Plus /> Add custom group candidate
          </Button>
        </div>
        <div className="position-relative mx-3">
          <span
            className="text-muted text-nowrap position-absolute"
            style={{ fontSize: "12px", top: "-15px", left: "-15px" }}
          >
            Groups to
          </span>
          <ArrowRight width="24" height="24" />
        </div>
      </div>
      <div className="col-5 col-sm-6 d-flex align-items-center">
        {isUserCreated
          ? (
            <Form.Control
              defaultValue={groupedCityName}
              onBlur={(e) =>
                onChangeGroupedName(id, e.target.value)
              }
            />
          )
          : (
            <p className="mb-0 fs-5">
              {groupedCityName}
            </p>
          )}
        {(translatedGroupedCityName && !isUserCreated) && (
          <span className="text-muted" style={{ fontSize: "14px" }}>
            ({translatedGroupedCityName})
          </span>
        )}
      </div>
      {isUserCreated && (
        <div className="mt-3 col-12">
          <Button
            className="w-100"
            variant="outline-danger"
            onClick={() => onRemoveGroupedName(id)}
          >
            <Trash className="me-2" />
            Delete this row
          </Button>
        </div>
      )}
    </div>
  );
};
