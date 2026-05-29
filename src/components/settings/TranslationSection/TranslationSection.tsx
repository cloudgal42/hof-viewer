import { DropdownSetting } from "../SettingsComponents/DropdownSetting.tsx";
import type {DisplayModes, TranslateOptions} from "../../../interfaces/TranslationSettings.ts";
import {useTranslationSettings} from "../../../hooks/useTranslationSettings.ts";

export const TranslationSection = () => {
  const [translationSettings, setTranslationSettings, defaultSettings] = useTranslationSettings();

  return (
    <section id="translation">
      <h3 className="fs-4 mb-3">Name Translation</h3>
      <DropdownSetting
        label="Display City Names"
        id="displayCityNames"
        name="displayCityNames"
        value={translationSettings.displayCityNames}
        ogValue={defaultSettings.displayCityNames}
        onClickReset={() => setTranslationSettings({
          ...translationSettings,
          displayCityNames: defaultSettings.displayCityNames
        })}
        onChange={e => {
          if (["both", "original", "translated"].includes(e.currentTarget.value)) {
            setTranslationSettings({
              ...translationSettings,
              displayCityNames: e.currentTarget.value as DisplayModes
            });
          }
        }}
        helpBlock="Change how should non-Latin city names be displayed on the Home page or the City Details page."
      >
        <option value="both">Show both (if possible)</option>
        <option value="original">Show original name only</option>
        <option value="translated">
          Show translated/transilaterated name only
        </option>
      </DropdownSetting>
      <DropdownSetting
        label="City Name"
        id="translateCityType"
        name="translateCityType"
        value={translationSettings.translateCityType}
        ogValue={defaultSettings.translateCityType}
        onClickReset={() => setTranslationSettings({
          ...translationSettings,
          translateCityType: defaultSettings.translateCityType
        })}
        onChange={e => {
          if (["none", "transliterate", "translate"].includes(e.currentTarget.value)) {
            setTranslationSettings({
              ...translationSettings,
              translateCityType: e.currentTarget.value as TranslateOptions
            });
          }
        }}
        helpBlock="Change how non-Latin city names should be handled"
      >
        <option value="none">Do not translate</option>
        <option value="transliterate">Transliterate</option>
        <option value="translate">Translate</option>
      </DropdownSetting>
      <DropdownSetting
        label="Creator Name"
        id="translateCreatorType"
        name="translateCreatorType"
        value={translationSettings.translateCreatorType}
        ogValue={defaultSettings.translateCreatorType}
        onClickReset={() => setTranslationSettings({
          ...translationSettings,
          translateCreatorType: defaultSettings.translateCreatorType
        })}
        onChange={e => {
          if (["none", "transliterate", "translate"].includes(e.currentTarget.value)) {
            setTranslationSettings({
              ...translationSettings,
              translateCreatorType: e.currentTarget.value as TranslateOptions
            });
          }
        }}
        helpBlock="Change how non-Latin creator names should be handled"
      >
        <option value="none">Do not translate</option>
        <option value="transliterate">Transliterate</option>
        <option value="translate">Translate</option>
      </DropdownSetting>
    </section>
  );
};
