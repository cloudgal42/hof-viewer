import { GripVertical, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import {useDraggable} from '@dnd-kit/react';
import {useRef} from "react";

export const DraggableEntry = ({
  cityName,
  groupedCityName,
  onRemoveUngroupedName,
  onChangeUngroupedName,
}: {
  cityName: UngroupedCityName;
  groupedCityName: string;
  onRemoveUngroupedName: (owner: string, name: string) => void;
  onChangeUngroupedName: (owner: string, name: string, newVal: string) => void;
}) => {
  const {handleRef, ref} = useDraggable({
    id: cityName.name
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="mb-2 d-flex gap-2 align-items-center"
      ref={ref}
    >
      <Button
        className="p-1"
        variant="outline"
        ref={handleRef}
        onMouseEnter={() => {
          if (inputRef.current) onChangeUngroupedName(
            groupedCityName,
            cityName.name,
            inputRef.current.value,
          )
        }}
      >
        <GripVertical />
      </Button>
      {cityName.isEditable
        ? (
          <div className="w-100 d-flex gap-2 align-items-center">
            <Form.Control
              ref={inputRef}
              onBlur={(e) => onChangeUngroupedName(
                groupedCityName,
                cityName.name,
                e.target.value,
              )}
              defaultValue={cityName.name}
            />
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
