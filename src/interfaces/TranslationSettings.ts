import type {TranslateOptions} from "./RandomAlgoSettings.ts";

export type DisplayModes = "both" | "original" | "translated";

export interface TranslationSettings {
  displayCityNames: DisplayModes;
  translateCityType: TranslateOptions;
  translateCreatorType: TranslateOptions;
}