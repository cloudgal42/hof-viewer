import {Card, Placeholder} from "react-bootstrap";
import {Cake, Eye, Heart, Images} from "react-bootstrap-icons";

export const PlaceholderCreatorCard = () => {
  return <Card className="w-100">
    <Card.Body className="row">
      <div className="col-12 col-sm-6">
        <Card.Title>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={5} />
          </Placeholder>
        </Card.Title>
        <Card.Subtitle>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
        </Card.Subtitle>
        <div className="d-flex mb-2 gap-2 align-items-center">
          <Cake />
          <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
            <Placeholder xs={6} />
          </Placeholder>
        </div>
        <Card.Title>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
        </Card.Title>
        <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
          <Placeholder className="me-2" xs={2} />
          <Placeholder className="me-2" xs={2} />
          <Placeholder className="me-2" xs={2} />
        </Placeholder>
      </div>
      <div className="col-12 col-sm-6">
        <Card.Title>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
        </Card.Title>
        <ul className="list-unstyled">
          <li className="d-flex gap-2 align-items-center">
            <Images />
            <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
              <Placeholder xs={1} />
            </Placeholder>
          </li>
          <li className="d-flex gap-2 align-items-center">
            <Eye />
            <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
              <Placeholder xs={1} />
            </Placeholder>
          </li>
          <li className="d-flex gap-2 align-items-center">
            <Heart />
            <Placeholder as={Card.Text} animation="glow" className="flex-grow-1">
              <Placeholder xs={1} />
            </Placeholder>
          </li>
        </ul>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
      </div>
    </Card.Body>
  </Card>
}