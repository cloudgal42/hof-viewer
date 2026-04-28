import { GripVertical, Trash } from "react-bootstrap-icons";
import { Button, Form, InputGroup } from "react-bootstrap";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";
import { useDraggable } from "@dnd-kit/react";
import { useContext, useRef, useState } from "react";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";

import "../../../css/components/DraggableEntry.css";

export const DraggableEntry = ({
  cityName,
  id,
  ownerId,
}: {
  cityName: UngroupedCityName;
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
    } else if (newVal === cityName.name) {
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
    <>
      {cityName.isEditable
        ? (
          <div className="input-actions" ref={ref}>
            <InputGroup className={`draggable-entry-field`}>
              <Button
                className="p-1 border-start border-top border-bottom border-1 bg-body-secondary text-body-secondary"
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
                disabled={isInvalid}
              >
                <GripVertical />
              </Button>
              <Form.Control
                className={`${isInvalid && "is-invalid"}`}
                ref={inputRef}
                name="groupCandidateName"
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
                <span className="visually-hidden">Delete</span>
              </Button>
            </InputGroup>
            {isInvalid && (
              <Form.Control.Feedback
                type="invalid"
                className="w-100 mb-1 d-block"
              >
                Each grouped candidates must have a unique name per creator
                preset.
              </Form.Control.Feedback>
            )}
          </div>
        )
        : (
          <div
            className={`input-actions border border-1 rounded-2 d-flex gap-2 align-items-center`}
            ref={ref}
          >
            <Button
              className="p-1 bg-body-secondary text-body-secondary border-start-0 border-top-0 border-bottom-0"
              variant="outline"
              ref={handleRef}
              style={{
                height: "38px",
                borderBottomLeftRadius: "0.375rem",
                borderTopLeftRadius: "0.375rem",
                borderBottomRightRadius: "0",
                borderTopRightRadius: "0",
              }}
            >
              <GripVertical />
            </Button>
            <p
              className="mb-0 ms-1 d-flex align-items-center text-truncate"
              style={{ minHeight: "38px" }}
            >
              {cityName.name}
            </p>
          </div>
        )}
    </>
  );
};
