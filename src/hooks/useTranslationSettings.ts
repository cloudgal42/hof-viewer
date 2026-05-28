import {useLocalStorage} from "usehooks-ts";
import type {TranslationSettings} from "../interfaces/TranslationSettings.ts";
import type {Dispatch, SetStateAction} from "react";

type useTranslationSettingsReturnType = [
  TranslationSettings,
  Dispatch<SetStateAction<TranslationSettings>>
];

export const useTranslationSettings = (): useTranslationSettingsReturnType => {
  const [translationSettings, setTranslationSettings] = useLocalStorage<TranslationSettings>(
    "translationSettings",
    {
      displayCityNames: "both",
      translateCityType: "transliterate",
      translateCreatorType: "transliterate",
    }
  );

  return [translationSettings, setTranslationSettings];
}