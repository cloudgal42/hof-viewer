import {ArrowRight, GripVertical, Plus, Trash, Trash2} from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type {UngroupedCityName} from "../../../interfaces/UngroupedCityName.ts";

export const GroupedCityRow = ({
  ungroupedCityNames,
  groupedCityName,
  translatedGroupedCityName,
  onAdd,
} : {
  ungroupedCityNames: UngroupedCityName[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
  onAdd?: () => void;
}) => {
  return (
    <div className="row mb-3">
      <div className="col-6 pe-0 d-flex gap-2 align-items-center">
        <div className="flex-grow-1">
          {ungroupedCityNames.map((cityName) => (
            <div className="mb-2 d-flex gap-2 align-items-center">
              <GripVertical size="16" />
              {cityName.isEditable ? (
                <div className="w-100 d-flex gap-2 align-items-center">
                  <Form.Control defaultValue={cityName.name} />
                  <Button variant="outline-danger">
                    <Trash />
                    <span className="visually-hidden">Delete this entry</span>
                  </Button>
                </div>
              ) : (
                <p
                  className="mb-0 d-flex align-items-center"
                  style={{minHeight: "38px"}}
                >
                  {cityName.name}
                </p>
              )}
            </div>
          ))}
          <Button className="w-100 text-truncate" variant="outline-primary">
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
        <p className="mb-0 fs-5 ">
          {groupedCityName}
          {translatedGroupedCityName && (
            <span className="text-muted" style={{ fontSize: "14px" }}>
              ({translatedGroupedCityName})
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
