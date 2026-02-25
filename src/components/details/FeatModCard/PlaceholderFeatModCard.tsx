import {Card, Placeholder} from "react-bootstrap";
import PlaceholderImg from "../../../assets/placeholder.svg";

export const PlaceholderFeatModCard = () => {
  return (
    <Card className="row flex-md-row gx-0">
      <img
        className="col-12 col-md-4 w-100 w-md-25"
        src={PlaceholderImg}
        alt=""
        style={{aspectRatio: "1/1"}}
      />
      <Card.Body className="col-12 col-md-8">
        <Card.Title>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
          <span className="text-muted" style={{fontSize: "14px"}}></span>
        </Card.Title>
        <Card.Subtitle className="text-muted mb-1">
          <Placeholder as={Card.Subtitle} animation="glow">
            <Placeholder xs={2} />
          </Placeholder>
        </Card.Subtitle>
        {/* TODO: add date range after version number */}
        <Placeholder animation="glow">
          <Placeholder className="me-2" xs={1} />
          <Placeholder className="me-2" xs={1} />
          <Placeholder className="me-2" xs={1} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button className="me-2" variant="outline-primary" aria-hidden={true} xs={2} />
        <Placeholder.Button variant="outline-primary" aria-hidden={true} xs={2} />
      </Card.Body>
    </Card>
  )
}