import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useState } from "react";

export const AddGroup = ({
  onAdd,
} : {
  onAdd: () => void;
}) => {
  const [addButtonHovered, setAddButtonHovered] = useState(false);

  return (
    <div className="mt-2 d-flex align-items-center">
      <OverlayTrigger overlay={<Tooltip>Add new grouped city entry</Tooltip>}>
        <Button
          className="p-1 rounded-4"
          variant="outline-primary"
          size="sm"
          onMouseEnter={() => setAddButtonHovered(true)}
          onMouseLeave={() => setAddButtonHovered(false)}
          onClick={onAdd}
        >
          <Plus size="24" />
          <span className="visually-hidden">Add new grouped city entry</span>
        </Button>
      </OverlayTrigger>
      <div
        className={`${
          addButtonHovered
            ? "border-3 border-primary-subtle"
            : "border-light-subtle"
        } border-top w-100`}
      />
    </div>
  );
};
