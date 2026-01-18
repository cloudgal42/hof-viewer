import {Card, Placeholder} from "react-bootstrap";
import PlaceholderImg from "../assets/placeholder.svg";

export const PlaceholderModCard = () => {
  return (
    <Card className="row flex-md-row gx-0">
      <img className="col-12 col-md-4 w-100 w-md-25" src={PlaceholderImg}/>
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
        <p className="mb-0 text-muted"></p>
      </Card.Body>
    </Card>
  )
}