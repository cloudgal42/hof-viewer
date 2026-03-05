export type TranslateOptions = "none" | "transliterate" | "translate"

export interface RandomAlgoSettings {
  translateCityType: TranslateOptions;
  translateCreatorType: TranslateOptions;
  random: number;
  popular: number;
  trending: number;
  recent: number;
  archeologist: number;
  supporter: number;
  viewMaxAge: number;
}