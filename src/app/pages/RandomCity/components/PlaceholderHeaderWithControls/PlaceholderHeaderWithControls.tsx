import {Button, OverlayTrigger, Placeholder, Tooltip} from "react-bootstrap";
import {ChevronLeft, ChevronRight, ThreeDotsVertical} from "react-bootstrap-icons";

export const PlaceholderHeaderWithControls = () => (
  <div className="w-100 d-flex flex-row align-items-center justify-content-between">
    <Button
      variant="outline"
      disabled={true}
    >
      <OverlayTrigger overlay={<Tooltip>To previous city</Tooltip>}>
        <ChevronLeft width="20" height="20"/>
      </OverlayTrigger>
    </Button>
    <div className="flex-grow-1">
      <span className="position-relative" style={{left: "calc(100% / 4)"}}>
        <span className="mb-0">
        <h2 className="d-inline me-2 mb-0">
          <Placeholder animation="glow">
            <Placeholder xs={3} size="lg"/>
          </Placeholder>
        </h2>
        <h3 className="d-inline me-3 text-muted fs-5">
          <Placeholder animation="glow">
            <Placeholder xs={2} size="lg"/>
          </Placeholder>
        </h3>
        <Button variant="outline" className="d-inline" disabled={true}>
          <ThreeDotsVertical/>
        </Button>
      </span>
      </span>
    </div>
    <Button
      variant="outline"
      disabled={true}
    >
      <OverlayTrigger overlay={<Tooltip>To next city</Tooltip>}>
        <ChevronRight width="20" height="20"/>
      </OverlayTrigger>
    </Button>
  </div>
)