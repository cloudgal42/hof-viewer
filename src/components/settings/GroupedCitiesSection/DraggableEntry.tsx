import { GripVertical, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import { useDraggable } from "@dnd-kit/react";
import {useContext, useRef} from "react";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";

export const DraggableEntry = ({
  cityName,
  groupedCityName,
  id,
  ownerId,
}: {
  cityName: UngroupedCityName;
  groupedCityName: string;
  id: string;
  ownerId: string;
}) => {
  const { handleRef, ref } = useDraggable({
    id,
  });

  const { onRemoveUngroupedName, onChangeUngroupedName } = useContext(
    GroupedSettingsContext,
  );

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
          if (inputRef.current) {
            onChangeUngroupedName(
              ownerId,
              cityName.id,
              inputRef.current.value,
            );
          }
        }}
      >
        <GripVertical />
      </Button>
      {cityName.isEditable
        ? (
          <div className="w-100 d-flex gap-2 align-items-center">
            <Form.Control
              ref={inputRef}
              onBlur={(e) =>
                onChangeUngroupedName(
                  ownerId,
                  cityName.id,
                  e.target.value,
                )}
              defaultValue={cityName.name}
            />
            <Button
              variant="outline-danger"
              onClick={() =>
                onRemoveUngroupedName(ownerId, cityName.id)}
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
