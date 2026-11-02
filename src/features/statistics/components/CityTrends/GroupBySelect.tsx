import {Form} from "react-bootstrap";

const DAYS_IN_MILLISECONDS = 86400000;

export const GroupBySelect = (
  {groupPeriod, currEpoch, createdAtEpoch, setGroupPeriod} : {
    groupPeriod: number;
    setGroupPeriod: (newGroupPeriod: number) => void;
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
          setGroupPeriod(parseInt(e.currentTarget.value))}
      >
        <option value="1">Days</option>
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 7) &&
          <option value="7">Weeks</option>}
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30) &&
          <option value="30">1 Month</option>}
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 30 * 6) &&
          <option value="180">6 Months</option>}
        {currEpoch > createdAtEpoch + (DAYS_IN_MILLISECONDS * 365) &&
          <option value="365">1 Year</option>}
      </Form.Select>
    </div>
  </>
)