import { createContext } from "react";

export interface GroupedSettingsFns {
  onAdd: (name: string) => void;
  onRemoveGroupCandidate: (ownerId: string, id: string) => void;
  onRemoveGroupedName: (id: string) => void;
  onChangeGroupCandidate: (ownerId: string, id: string, newVal: string) => void;
  onChangeGroupedName: (id: string, newVal: string) => void;
  isGroupCandidateAlreadyExists: (parentId: string, id: string, name: string) => boolean;
  isRowAlreadyExists: (name: string) => boolean;
}

export const GroupedSettingsContext = createContext<GroupedSettingsFns>({
  onAdd: (name: string) => {},
  onRemoveGroupCandidate: (ownerId: string, id: string) => {
  },
  onRemoveGroupedName: (id: string) => {
  },
  onChangeGroupCandidate: (ownerId: string, id: string, newVal: string) => {
  },
  onChangeGroupedName: (id: string, newVal: string) => {
  },
  isGroupCandidateAlreadyExists: (parentId: string, id: string, name: string) => false,
  isRowAlreadyExists: (name: string) => false,
});
