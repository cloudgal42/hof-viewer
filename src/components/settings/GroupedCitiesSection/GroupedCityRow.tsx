import {
  ArrowRight,
  GripVertical,
  Plus,
  Trash,
} from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import {DraggableEntry} from "./DraggableEntry.tsx";

export const GroupedCityRow = ({
  ungroupedCityNames,
  groupedCityName,
  translatedGroupedCityName,
  isUserCreated,
  onAdd,
  onRemoveUngroupedName,
  onRemoveGroupedName,
}: {
  ungroupedCityNames: UngroupedCityName[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
  isUserCreated: boolean;
  onAdd: (name: string) => void;
  onRemoveUngroupedName: (owner: string, name: string) => void;
  onRemoveGroupedName: (name: string) => void;
}) => {
  return (
    <div className="row mb-3">
      <div className="col-6 pe-0 d-flex gap-2 align-items-center">
        <div className="flex-grow-1">
          {ungroupedCityNames.map((cityName) => (
            <DraggableEntry
              cityName={cityName}
              groupedCityName={groupedCityName}
              onRemoveUngroupedName={onRemoveUngroupedName}
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
              <Form.Control defaultValue={groupedCityName} />
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
