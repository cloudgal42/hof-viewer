import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import type {Dispatch, SetStateAction} from "react";

export const TrendTypeToggle = (
  {trendType, setTrendType} : {trendType: string, setTrendType: Dispatch<SetStateAction<string>>}
) => (
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
)