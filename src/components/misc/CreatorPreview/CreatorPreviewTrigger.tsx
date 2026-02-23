import {type ReactElement, useState} from "react";
import {CreatorPreviewPopoverBody} from "./CreatorPreviewPopoverBody.tsx";
import {OverlayTrigger, Popover} from "react-bootstrap";

export const CreatorPreviewTrigger = (
  {
    creator,
    children,
    showLinks,
  } : {
    creator: string | null,
    children: ReactElement,
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
      placement="auto"
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