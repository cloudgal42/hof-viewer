import {Card, Placeholder} from "react-bootstrap";
import PlaceholderImg from "../assets/placeholder.svg"
import {Eye, Heart, Person} from "react-bootstrap-icons";

export const PlaceholderCard = () => {
  return (
    <div className="col-6 col-md-4">
      <Card>
        <Card.Img variant="top" src={PlaceholderImg}/>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6}/>
          </Placeholder>
          <Placeholder className="mb-1" as={Card.Subtitle} animation="glow">
            <Placeholder xs={4}/>
          </Placeholder>
          <Placeholder className="mb-1 d-flex gap-2 text-muted" as={Card.Text} animation="glow">
            <span className="d-flex flex-grow-1 align-items-center">
              <Person/>
              <Placeholder className="ms-1" xs={2}/>
            </span>
            <span className="d-flex flex-grow-1 align-items-center">
              <Eye/>
              <Placeholder className="ms-1" xs={2}/>
            </span>
            <span className="d-flex flex-grow-1 align-items-center">
              <Heart/>
              <Placeholder className="ms-1" xs={2}/>
            </span>
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={4}/>
          </Placeholder>
        </Card.Body>
      </Card>
    </div>
  )
}