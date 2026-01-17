import {Card} from "react-bootstrap";
import {BoxArrowUpRight} from "react-bootstrap-icons";

export const ModCard = () => {
  return (
    <Card className="row flex-md-row gx-0">
      <img
        className="col-4 w-25 object-fit-cover"
        src="https://modscontent.paradox-interactive.com/cities_skylines_2/b6d5e23c-388f-4c5a-b493-9f7742677331/content/screenshots/screenshot_1.png?class=modsui_gallery_screenshot"
        alt=""
      />
      <Card.Body className="col-8">
        <Card.Title>
          <a href="" target="_blank" className="d-inline-flex gap-2 me-2 align-items-center">
            ExtraLib
            <BoxArrowUpRight width="16" height="16"/>
          </a>
          <span className="text-muted" style={{fontSize: "14px"}}>{`latest: 2.2.2`}</span>
        </Card.Title>
        <Card.Subtitle className="text-muted mb-1">by Triton Supreme</Card.Subtitle>
        {/* TODO: add date range after version number */}
        <p className="mb-0 text-muted">Extra Lib is a necessary dependency module needed to operate all EXTRA
          modifications.</p>
      </Card.Body>
    </Card>
  )
}