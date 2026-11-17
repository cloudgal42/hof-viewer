import {useState} from "react";
import type { GroupPeriod } from "../types/TrendsData";

const DAYS_IN_MILLISECONDS = 86400000;

export const useTrendsOptions = (
  currEpoch: number, createdAtEpoch: number
) => {
  const [trendType, setTrendType] = useState<string>("views");
  const [groupPeriod, setGroupPeriod] = useState<GroupPeriod>(() => {
    if (currEpoch >= createdAtEpoch + (DAYS_IN_MILLISECONDS * 365 * 2)) {
      return "month";
    } else if (currEpoch >= createdAtEpoch + (DAYS_IN_MILLISECONDS * 6 * 30)) {
      return "week";
    }
    
    return "day";
  });
  
  return {trendType, setTrendType, groupPeriod, setGroupPeriod};
}
