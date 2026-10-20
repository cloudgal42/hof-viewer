import {useLocalStorage} from "usehooks-ts";
import type {TranslationSettings} from "../interfaces/TranslationSettings.ts";
import type {Dispatch, SetStateAction} from "react";
import {CONFIG} from "../config/Config.ts";

type useTranslationSettingsReturnType = [
  TranslationSettings,
  Dispatch<SetStateAction<TranslationSettings>>,
  TranslationSettings
];

export const useTranslationSettings = (): useTranslationSettingsReturnType => {
  const [translationSettings, setTranslationSettings] = useLocalStorage<TranslationSettings>(
    "translationSettings", CONFIG.defaultTranslationSettings);

  return [translationSettings, setTranslationSettings, CONFIG.defaultTranslationSettings];
}