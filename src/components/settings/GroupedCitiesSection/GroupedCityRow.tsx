import { ArrowRight, GripVertical, Plus, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import { DraggableEntry } from "./DraggableEntry.tsx";
import { useDroppable } from "@dnd-kit/react";

export const GroupedCityRow = ({
  ungroupedCityNames,
  groupedCityName,
  translatedGroupedCityName,
  isUserCreated,
  onAdd,
  onRemoveUngroupedName,
  onRemoveGroupedName,
  onChangeUngroupedName,
  onChangeGroupedName,
}: {
  ungroupedCityNames: UngroupedCityName[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
  isUserCreated: boolean;
  onAdd: (name: string) => void;
  onRemoveUngroupedName: (owner: string, name: string) => void;
  onRemoveGroupedName: (name: string) => void;
  onChangeUngroupedName: (owner: string, name: string, newVal: string) => void;
  onChangeGroupedName: (name: string, newVal: string) => void;
}) => {
  const { ref, isDropTarget } = useDroppable({
    id: groupedCityName,
  });

  return (
    <div className="row mb-3">
      <div className="col-6 pe-0 d-flex gap-2 align-items-center">
        <div
          className={`flex-grow-1 border border-primary border-2 rounded-2 overflow-hidden ${isDropTarget ? "border-opacity-50" : "border-opacity-0"}`}
          ref={ref}
        >
          {ungroupedCityNames.map((cityName) => (
            <DraggableEntry
              key={groupedCityName + cityName.name}
              cityName={cityName}
              groupedCityName={groupedCityName}
              onRemoveUngroupedName={onRemoveUngroupedName}
              onChangeUngroupedName={onChangeUngroupedName}
            />
          ))}
          <Button
            className="w-100 text-truncate"
            variant="outline-primary"
            onClick={() => onAdd(groupedCityName)}
          >
            <Plus /> Add custom city name
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
      <div className="col-6 d-flex align-items-center">
        {isUserCreated
          ? (
            <>
              <Form.Control
                defaultValue={groupedCityName}
                onBlur={(e) =>
                  onChangeGroupedName(groupedCityName, e.target.value)
                }
              />
              {/*<Button*/}
              {/*  className="ms-2"*/}
              {/*  variant="outline-danger"*/}
              {/*  onClick={() => onRemoveGroupedName(groupedCityName)}*/}
              {/*>*/}
              {/*  <Trash />*/}
              {/*  <span className="visually-hidden">Delete this entry</span>*/}
              {/*</Button>*/}
            </>
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
            onClick={() => onRemoveGroupedName(groupedCityName)}
          >
            <Trash className="me-2" />
            Delete this row
          </Button>
        </div>
      )}
    </div>
  );
};
