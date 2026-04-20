import {Button, Card, Placeholder} from "react-bootstrap";

import PlaceholderImg from "../../../assets/placeholder.svg";
import {ZoomIn, ZoomOut} from "react-bootstrap-icons";

export const PlaceholderInsights = () => {
  return (
    <Card>
      <Card.Body>
        <section className="mb-3">
          <Placeholder className="mb-2" animation="glow">
            <Placeholder className="d-block mb-3" as={Card.Title} xs={4} />
            <img src={PlaceholderImg} className="w-100 mb-3" height="50" alt="" />
          </Placeholder>
          <div className="d-flex gap-2">
            <Placeholder.Button
              variant="outline-primary"
              aria-hidden="true"
              xs={2}
            />
            <Placeholder.Button
              variant="outline-primary"
              aria-hidden="true"
              style={{width: "42px", height: "38px"}}
            />
            <Placeholder.Button
              variant="outline-primary"
              aria-hidden="true"
              style={{width: "42px", height: "38px"}}
            />
          </div>
        </section>
        <section>
          <Placeholder className="mb-2" animation="glow">
            <Placeholder className="d-block mb-3" as={Card.Title} xs={4} />
            <img src={PlaceholderImg} className="w-100 mb-3" height="50" alt="" />
          </Placeholder>
          <div className="d-flex gap-2">
            <Placeholder.Button
              variant="outline-primary"
              aria-hidden="true"
              xs={2}
            />
            <Placeholder.Button
              variant="outline-primary"
              aria-hidden="true"
              style={{width: "42px", height: "38px"}}
            />
            <Placeholder.Button
              variant="outline-primary"
              aria-hidden="true"
              style={{width: "42px", height: "38px"}}
            />
          </div>
        </section>
      </Card.Body>
    </Card>
  );
};
