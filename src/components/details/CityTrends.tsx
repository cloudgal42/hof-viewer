import {Button, ButtonGroup, Card} from "react-bootstrap";

export const CityStats = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Stat Trends</Card.Title>
        <ButtonGroup className="w-100" aria-label="Data type">
          <Button variant="outline-primary">Views</Button>
          <Button variant="outline-primary">Likes</Button>
        </ButtonGroup>
        {/* FIXME */}
        <div className="py-5 my-5"></div>
      </Card.Body>
    </Card>
  )
}