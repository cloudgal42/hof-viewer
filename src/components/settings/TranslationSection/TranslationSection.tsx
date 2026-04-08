import { DropdownSetting } from "../SettingsComponents/DropdownSetting.tsx";

export const TranslationSection = () => {
  return (
    <section id="translation" style={{scrollMarginTop: "10px"}}>
      <h3 className="fs-4 mb-3">Name Translation</h3>
      <DropdownSetting
        label="Display City Names"
        id="cityNameDisplay"
        name="cityNameDisplay"
        helpBlock="Change how should non-Latin city names be displayed on the Home page or the City Details page."
      >
        <option value="both">Show both (if possible)</option>
        <option value="none">Show original name only</option>
        <option value="none">
          Show translated/transilaterated name only
        </option>
      </DropdownSetting>
      <DropdownSetting
        label="City Name"
        id="cityNameTranslate"
        name="cityNameTranslate"
        helpBlock="Change how non-Latin city names should be handled"
      >
        <option value="none">Do not translate</option>
        <option value="transliterate">Transliterate</option>
        <option value="translate">Translate</option>
      </DropdownSetting>
      <DropdownSetting
        label="Creator Name"
        id="creatorNameTranslate"
        name="creatorNameTranslate"
        helpBlock="Change how non-Latin creator names should be handled"
      >
        <option value="none">Do not translate</option>
        <option value="transliterate">Transliterate</option>
        <option value="translate">Translate</option>
      </DropdownSetting>
    </section>
  );
};
