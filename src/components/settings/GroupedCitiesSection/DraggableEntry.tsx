import { GripVertical, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import { useDraggable } from "@dnd-kit/react";
import { useContext, useRef, useState } from "react";
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

  const {
    onRemoveUngroupedName,
    onChangeUngroupedName,
    isUngroupedNameAlreadyExists,
  } = useContext(GroupedSettingsContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  function handleUpdate(
    ownerId: string,
    targetId: string,
    newVal: string,
  ) {
    if (isUngroupedNameAlreadyExists(ownerId, id, newVal)) {
      setIsInvalid(true);
      return;
    }

    onChangeUngroupedName(
      ownerId,
      targetId,
      newVal,
    );
    setIsInvalid(false);
  }

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
            handleUpdate(
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
          <div className="w-100">
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                className={isInvalid ? "is-invalid" : ""}
                ref={inputRef}
                onBlur={(e) =>
                  handleUpdate(
                    ownerId,
                    cityName.id,
                    e.target.value,
                  )}
                defaultValue={cityName.name}
              />
              <Button
                variant="outline-danger"
                onClick={() => onRemoveUngroupedName(ownerId, cityName.id)}
              >
                <Trash />
                <span className="visually-hidden">Delete this entry</span>
              </Button>
            </div>
            {isInvalid && (
              <Form.Control.Feedback type="invalid" className="w-100 d-block">
                Each of these grouped candidates must be globally unique.
              </Form.Control.Feedback>
            )}
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
