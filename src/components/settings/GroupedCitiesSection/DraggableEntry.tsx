import { GripVertical, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";

export const DraggableEntry = ({
  cityName,
  groupedCityName,
  onRemoveUngroupedName,
}: {
  cityName: UngroupedCityName;
  groupedCityName: string;
  onRemoveUngroupedName: (owner: string, name: string) => void;
}) => {
  return (
    <div
      key={cityName.name}
      className="mb-2 d-flex gap-2 align-items-center"
    >
      <div>
        <GripVertical />
      </div>
      {cityName.isEditable
        ? (
          <div className="w-100 d-flex gap-2 align-items-center">
            <Form.Control defaultValue={cityName.name} />
            <Button
              variant="outline-danger"
              onClick={() =>
                onRemoveUngroupedName(groupedCityName, cityName.name)}
            >
              <Trash />
              <span className="visually-hidden">Delete this entry</span>
            </Button>
          </div>
        )
        : (
          <p
            className="mb-0 d-flex align-items-center"
            style={{ minHeight: "38px" }}
          >
            {cityName.name}
          </p>
        )}
    </div>
  );
};
