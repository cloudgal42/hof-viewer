import {Placeholder} from "react-bootstrap";

export const PlaceholderHeader = () => (
  <>
    <div className="mb-2">
      <h2 className="mb-0">
        <Placeholder animation="glow">
          <Placeholder xs={5} size="lg"/>
        </Placeholder>
      </h2>
    </div>
    <h3 className="text-muted fs-5">
      <Placeholder animation="glow">
        <Placeholder xs={3} size="lg"/>
      </Placeholder>
    </h3>
  </>
)