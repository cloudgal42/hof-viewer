import { createContext } from "react";

export interface GroupedSettingsFns {
  onAdd: (name: string) => void;
  onRemoveUngroupedName: (owner: string, name: string) => void;
  onRemoveGroupedName: (name: string) => void;
  onChangeUngroupedName: (owner: string, name: string, newVal: string) => void;
  onChangeGroupedName: (name: string, newVal: string) => void;
}

export const GroupedSettingsContext = createContext<GroupedSettingsFns>({
  onAdd: (name: string) => {},
  onRemoveUngroupedName: (owner: string, name: string) => {
  },
  onRemoveGroupedName: (name: string) => {
  },
  onChangeUngroupedName: (owner: string, name: string, newVal: string) => {
  },
  onChangeGroupedName: (name: string, newVal: string) => {
  },
});
