import {type ReactElement, useState} from "react";
import {CreatorPreviewPopoverBody} from "./CreatorPreviewPopoverBody.tsx";
import {OverlayTrigger, Popover} from "react-bootstrap";
import type {Placement} from "@popperjs/core";

export const CreatorPreviewTrigger = (
  {
    creator,
    children,
    placement,
    showLinks,
  } : {
    creator: string | null,
    children: ReactElement,
    placement: Placement,
    showLinks: boolean,
  }
) => {
  const [show, setShow] = useState(false);

  return (
    <OverlayTrigger
      overlay={
        <Popover
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <CreatorPreviewPopoverBody creator={creator} showLinks={showLinks} />
        </Popover>
      }
      placement={placement}
      show={show}
    >
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
    </OverlayTrigger>
  )
}