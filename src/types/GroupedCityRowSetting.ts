import type {GroupCandidate} from "../features/settings/types/GroupCandidate.ts";

export interface GroupedCityRowSetting {
  groupCandidates: GroupCandidate[];
  groupedCityName: string;
  translatedGroupedCityName?: string;
  latinizedGroupedCityName?: string;
  isUserCreated: boolean;
  id: string;
  isModified: boolean;
}