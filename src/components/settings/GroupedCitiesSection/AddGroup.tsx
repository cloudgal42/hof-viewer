import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {Ban, Plus} from "react-bootstrap-icons";
import { useContext, useState } from "react";
import { useDroppable } from "@dnd-kit/react";
import { GroupedSettingsContext } from "../../../context/GroupedSettingsContext.ts";
import type { UngroupedCityName } from "../../../interfaces/UngroupedCityName.ts";

export const AddGroup = ({
  onAdd,
  position,
  currCandidate,
}: {
  onAdd: (position: "top" | "bottom") => void;
  position: "top" | "bottom";
  currCandidate: UngroupedCityName | null;
}) => {
  const { ref, isDropTarget } = useDroppable({
    id: "addGroup" + position,
  });
  const { isRowAlreadyExists } = useContext(GroupedSettingsContext);
  const isInvalid = Boolean(
    currCandidate && isRowAlreadyExists(currCandidate?.name),
  );

  return (
    <div
      className="mt-3 d-flex align-items-center"
      style={{ minWidth: "500px" }}
      ref={ref}
    >
      <Button
        className={`w-100 ${
          isDropTarget && !isInvalid ? "border-primary" : ""
        }`}
        variant="outline-primary"
        onClick={() => onAdd(position)}
        disabled={isInvalid && isDropTarget}
      >
        {isDropTarget && !isInvalid
          ? (
            <>
              <Plus />
              Drop here to create a new group with this name
            </>
          )
          : isDropTarget && isInvalid
          ? (
              <>
                <Ban className="me-2" />
                Creation of duplicated group names are not allowed
              </>
            )
          : (
              <>
                <Plus />
                Add new group entry
              </>
            )}
      </Button>
    </div>
  );
};
