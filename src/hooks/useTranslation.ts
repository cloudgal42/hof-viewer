import type { Creator } from "../interfaces/Creator.ts";
import { useLocalStorage } from "usehooks-ts";
import type { TranslationSettings } from "../interfaces/TranslationSettings.ts";
import { CONFIG } from "../config/Config.ts";
import type { City, GroupedCities } from "../interfaces/City.ts";

// TODO: Consider making translationSettings a context instead
export const useTranslation = () => {
  const [translationSettings] = useLocalStorage<TranslationSettings>(
    "translationSettings",
    CONFIG.defaultTranslationSettings,
  );

  function titleCityName(city: City | GroupedCities) {
    if (translationSettings.displayCityNames === "translated") {
      return dynamicCityName(city);
    }

    return city.cityName;
  }

  function dynamicCityName(city: City | GroupedCities) {
    if (translationSettings.translateCityType === "transliterate") {
      return city.cityNameLatinized ?? city.cityName;
    } else if (translationSettings.translateCityType === "translate") {
      return city.cityNameTranslated ?? city.cityName;
    }

    return city.cityName;
  }

  function creatorName(creator: Creator) {
    if (translationSettings.translateCreatorType === "transliterate") {
      return creator.creatorNameLatinized ?? creator.creatorName;
    } else if (translationSettings.translateCreatorType === "translate") {
      return creator.creatorNameTranslated ?? creator.creatorName;
    }
    return creator.creatorName;
  }

  function subCityName(city: City | GroupedCities) {
    const name = dynamicCityName(city);
    return name === titleCityName(city) ||
        translationSettings.displayCityNames !== "both"
      ? ""
      : name;
  }

  return {
    titleCityName,
    dynamicCityName,
    subCityName,
    creatorName,
  };
};
