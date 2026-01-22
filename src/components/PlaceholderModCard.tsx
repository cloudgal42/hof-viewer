import {Card, Placeholder} from "react-bootstrap";
import PlaceholderImg from "../assets/placeholder.svg";

export const PlaceholderModCard = () => {
  return (
    <Card>
      <img
        className="h-100 w-100 object-fit-cover"
        src={PlaceholderImg}
        style={{aspectRatio: "1/1"}}
        alt=""
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="mb-1">
          <Card.Title className="mb-2">
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={7} />
            </Placeholder>
          </Card.Title>
          <Card.Subtitle className="text-muted mb-1">
            <Placeholder as={Card.Subtitle} animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
          </Card.Subtitle>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={4} />
          </Placeholder>
        </div>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
      </Card.Body>
    </Card>
  )
}