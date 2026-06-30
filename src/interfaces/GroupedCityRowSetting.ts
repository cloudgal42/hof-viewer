import type {GroupCandidate} from "./GroupCandidate.ts";

export interface GroupedCityRowSetting {
  groupCandidates: GroupCandidate[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
  isUserCreated: boolean;
  id: string;
}