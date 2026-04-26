import { createContext } from "react";

export interface GroupedSettingsFns {
  onAdd: (name: string) => void;
  onRemoveUngroupedName: (ownerId: string, id: string) => void;
  onRemoveGroupedName: (id: string) => void;
  onChangeUngroupedName: (ownerId: string, id: string, newVal: string) => void;
  onChangeGroupedName: (id: string, newVal: string) => void;
  isUngroupedNameAlreadyExists: (parentId: string, id: string, name: string) => boolean;
  isRowAlreadyExists: (name: string) => boolean;
}

export const GroupedSettingsContext = createContext<GroupedSettingsFns>({
  onAdd: (name: string) => {},
  onRemoveUngroupedName: (ownerId: string, id: string) => {
  },
  onRemoveGroupedName: (id: string) => {
  },
  onChangeUngroupedName: (ownerId: string, id: string, newVal: string) => {
  },
  onChangeGroupedName: (id: string, newVal: string) => {
  },
  isUngroupedNameAlreadyExists: (parentId: string, id: string, name: string) => false,
  isRowAlreadyExists: (name: string) => false,
});
