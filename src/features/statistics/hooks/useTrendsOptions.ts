import {useState} from "react";

const DAYS_IN_MILLISECONDS = 86400000;

export const useTrendsOptions = (
  currEpoch: number, createdAtEpoch: number
) => {
  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<number>(() => {
    if (currEpoch >= createdAtEpoch + (DAYS_IN_MILLISECONDS * 365 * 2)) {
      return 30;
    } else if (currEpoch >= createdAtEpoch + (DAYS_IN_MILLISECONDS * 6 * 30)) {
      return 7;
    }
    
    return 1;
  });
  
  return {trendType, setTrendType, groupPeriod, setGroupPeriod};
}