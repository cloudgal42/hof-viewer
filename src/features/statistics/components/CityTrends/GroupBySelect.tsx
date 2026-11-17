import {Form} from "react-bootstrap";
import type { GroupPeriod } from "../../types/TrendsData";

const DAYS_IN_MILLISECONDS = 86400000;

export const GroupBySelect = (
  {groupPeriod, currEpoch, createdAtEpoch, setGroupPeriod} : {
    groupPeriod: GroupPeriod;
    setGroupPeriod: (newGroupPeriod: GroupPeriod) => void;
    currEpoch: number;
    createdAtEpoch: number;
  }
) => (
  <>
    <label htmlFor="groupPeriod">Group by</label>
    <div>
      <Form.Select
        name="groupPeriod"
        id="groupPeriod"
        value={groupPeriod}
        onChange={(e) =>
          setGroupPeriod(e.currentTarget.value as GroupPeriod)}
      >
        <option value="day">Days</option>
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 7) &&
          <option value="week">Weeks</option>}
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30) &&
          <option value="month">1 Month</option>}
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30 * 6) &&
          <option value="halfyear">6 Months</option>}
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 365) &&
          <option value="year">1 Year</option>}
      </Form.Select>
    </div>
  </>
)
