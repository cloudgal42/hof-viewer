import {Card, Form, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {useState} from "react";

export const CityTrends = () => {
  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<number>(30);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Trends</Card.Title>
        <ToggleButtonGroup
          type="radio"
          name="trendsType"
          className="w-100"
          aria-label="Data type"
          value={trendType}
          onChange={(value) => setTrendType(value)}
        >
          <ToggleButton
            value="views"
            id="views"
            variant="outline-primary"
          >
            Views
          </ToggleButton>
          <ToggleButton
            value="favorites"
            id="favorites"
            variant="outline-primary"
          >
            Favorites
          </ToggleButton>
        </ToggleButtonGroup>
        {/* FIXME */}
        <div className="py-5 my-5"></div>
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
          <p id="groupPeriodLabel" className="mb-0 d-md-inline-block">Group data by every:</p>
          <Form>
            <Form.Check
              className="d-inline-block me-2"
              type="radio"
              name="groupPeriod"
              value="365"
              id="year"
              label="1 year"
              checked={groupPeriod === 365}
              onChange={(e) => setGroupPeriod(parseInt(e.currentTarget.value))}
            >
            </Form.Check>
            <Form.Check
              className="d-inline-block me-2"
              type="radio"
              name="groupPeriod"
              value="180"
              id="halfYear"
              label="6 months"
              checked={groupPeriod === 180}
              onChange={(e) => setGroupPeriod(parseInt(e.currentTarget.value))}
            >
            </Form.Check>
            <Form.Check
              className="d-inline-block me-2"
              type="radio"
              name="groupPeriod"
              value="30"
              id="month"
              label="1 month"
              checked={groupPeriod === 30}
              onChange={(e) => setGroupPeriod(parseInt(e.currentTarget.value))}
            >
            </Form.Check>
            <Form.Check
              className="d-inline-block me-2"
              type="radio"
              name="groupPeriod"
              value="7"
              id="week"
              label="1 week"
              checked={groupPeriod === 7}
              onChange={(e) => setGroupPeriod(parseInt(e.currentTarget.value))}
            >
            </Form.Check>
          </Form>
        </div>
      </Card.Body>
    </Card>
  )
}