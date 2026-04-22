import type {ReactNode} from "react";
import {createPortal} from "react-dom";
import {Alert, Button} from "react-bootstrap";
import {ExclamationCircle} from "react-bootstrap-icons";

export const ErrorNotification = ({
  children,
}: {
  children: ReactNode;
}) => {
  const root = document.getElementById("root");

  if (!root) return;

  return (
    createPortal(
      <Alert
        variant="danger"
        className="position-fixed d-flex align-items-center gap-2"
        style={{bottom: "5px", left: "10px", width: "fit-content"}}
        dismissible
      >
        <ExclamationCircle />
        {children}
      </Alert>,
      root
    )
  )
};
