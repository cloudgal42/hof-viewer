import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useState } from "react";
import {useDroppable} from "@dnd-kit/react";

export const AddGroup = ({
  onAdd,
  position,
} : {
  onAdd: (pos: "top" | "bottom") => void;
  position: "top" | "bottom";
}) => {
  const { ref, isDropTarget } = useDroppable({
    id: "addGroup" + position,
  });

  return (
    <div
      className="mt-3 d-flex align-items-center"
      style={{minWidth: "500px"}}
      ref={ref}
    >
      <Button
        className={`w-100 ${(isDropTarget) ? "border-primary" : ""}`}
        variant="outline-primary"
        onClick={() => onAdd(position)}
      >
        <Plus />
        {isDropTarget ? "Drop here to create a new group with this name" : "Add new grouped city entry"}
      </Button>
    </div>
  );
};
