import {type ReactElement, useState} from "react";
import {CreatorPreviewPopoverBody} from "./CreatorPreviewPopoverBody.tsx";
import {OverlayTrigger, Popover} from "react-bootstrap";
import type {Creator} from "../../../interfaces/Creator.ts";

export const CreatorPreviewTrigger = (
  {
    creator,
    creatorName,
    children,
    showLinks,
  } : {
    creator: Creator,
    creatorName: string,
    children: ReactElement,
    showLinks: boolean,
  }
) => {
  const [show, setShow] = useState(false);
  const [showType, setShowType] = useState<"hover" | "click">("hover");

  function handleShowClick() {
    if (showType === "hover" && show) {
      setShowType("click");
      setShow(true);
    } else {
      setShow(!show);
    }
  }

  function handleShowHover(showStatus: boolean) {
    setShow(showStatus);
    if (showType === "click") setShowType("hover");
  }

  return (
    <OverlayTrigger
      overlay={
        <Popover
          onClick={handleShowClick}
          onMouseEnter={() => handleShowHover(true)}
          onMouseLeave={() => handleShowHover(false)}
        >
          <CreatorPreviewPopoverBody creator={creator} creatorName={creatorName} showLinks={showLinks} />
        </Popover>
      }
      placement="auto"
      show={show}
    >
      <span
        onClick={handleShowClick}
        onMouseEnter={() => handleShowHover(true)}
        onMouseLeave={() => handleShowHover(false)}
      >
        {children}
      </span>
    </OverlayTrigger>
  )
}