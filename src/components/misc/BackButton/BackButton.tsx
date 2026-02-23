import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {ChevronLeft} from "react-bootstrap-icons";
import * as React from "react";
import {useNavigate} from "react-router";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <>
      {window.history.length > 1 && (
        <OverlayTrigger overlay={<Tooltip>Back</Tooltip>}>
          <Button
            variant="outline"
            style={{border: "none", backgroundColor: "transparent"}}
            className="ps-0"
            aria-label="Back"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft width="24" height="24"/>
          </Button>
        </OverlayTrigger>
      )}
    </>
  )
}