import {useLocalStorage} from "usehooks-ts";
import type {RandomAlgoSettings} from "../interfaces/RandomAlgoSettings.ts";
import type {Dispatch, SetStateAction} from "react";

type useRandomAlgoSettingsReturnType = [
  RandomAlgoSettings,
  Dispatch<SetStateAction<RandomAlgoSettings>>,
  RandomAlgoSettings,
];

export const useRandomAlgoSettings = (): useRandomAlgoSettingsReturnType => {
  const defaultSettings = {
    random: 5,
    popular: 10,
    trending: 10,
    recent: 10,
    archeologist: 0,
    supporter: 1,
    viewMaxAge: 60,
  };

  const [randomAlgoSettings, setRandomAlgoSettings]
    = useLocalStorage<RandomAlgoSettings>("randomAlgoSettings", defaultSettings);

  return [randomAlgoSettings, setRandomAlgoSettings, defaultSettings];
}