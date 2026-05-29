import {useLocalStorage} from "usehooks-ts";
import type {TranslationSettings} from "../interfaces/TranslationSettings.ts";
import type {Dispatch, SetStateAction} from "react";

type useTranslationSettingsReturnType = [
  TranslationSettings,
  Dispatch<SetStateAction<TranslationSettings>>,
  TranslationSettings
];

export const useTranslationSettings = (): useTranslationSettingsReturnType => {
  const defaultSettings: TranslationSettings = {
    displayCityNames: "both",
    translateCityType: "transliterate",
    translateCreatorType: "transliterate",
  };

  const [translationSettings, setTranslationSettings] = useLocalStorage<TranslationSettings>(
    "translationSettings", defaultSettings);

  return [translationSettings, setTranslationSettings, defaultSettings];
}