import {Card, Form, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {useState} from "react";

export const CityTrends = () => {
  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<number>(30);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Trends</Card.Title>
        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-2">
          <div>
            <ToggleButtonGroup
              type="radio"
              className="w-100"
              name="trendsType"
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
                value="uniqueViews"
                id="uniqueViews"
                variant="outline-primary"
              >
                Views (Unique)
              </ToggleButton>
              <ToggleButton
                value="favorites"
                id="favorites"
                variant="outline-primary"
              >
                Favorites
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <label htmlFor="groupPeriod">Group by</label>
            <div>
              <Form.Select
                name="groupPeriod"
                id="groupPeriod"
                value={groupPeriod}
                onChange={(e) => setGroupPeriod(parseInt(e.currentTarget.value))}
              >
                <option value="1">Days</option>
                <option value="7">Weeks</option>
                <option value="30">1 Month</option>
                <option value="180">6 Months</option>
                <option value="365">1 Year</option>
              </Form.Select>
            </div>
          </div>
        </div>
        {/* FIXME */}
        <div className="py-5 my-5"></div>
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
        </div>
      </Card.Body>
    </Card>
  )
}