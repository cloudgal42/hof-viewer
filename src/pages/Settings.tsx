import { ToggleSetting } from "../components/settings/SettingSection/ToggleSetting.tsx";
import { SectionNav } from "../components/settings/SectionNav/SectionNav.tsx";
import { DropdownSetting } from "../components/settings/SettingSection/DropdownSetting.tsx";
import { RangeSetting } from "../components/settings/SettingSection/RangeSetting.tsx";

const Settings = () => {
  return (
    <div className="ms-4 ms-xxl-5 me-4 me-xxl-5 flex-grow-1 d-flex flex-column flex-lg-row justify-content-center">
      <SectionNav />
      <div className="settings-wrapper flex-grow-1">
        <section id="appearance">
          <h3 className="fs-4 mb-3">Appearance</h3>
          <ToggleSetting
            label="Dark Mode"
            id="darkMode"
            name="darkMode"
            helpBlock="Use dark mode for this website"
          />
        </section>
        <hr />
        <section id="groupedCities">
          <h3 className="fs-4 mb-3">Grouped Cities</h3>
          <p className="text-muted">TBD</p>
        </section>
        <hr />
        <section id="translation">
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
        <hr />
        <section id="algoSettings">
          <h3 className="fs-4 mb-2">Random City Algorithm</h3>
          <p className="text-muted fw-normal">
            Change how should Hall of Fame (HoF) weigh the next random
            screenshot. Note that HoF may not respect these settings if it is
            unable to find a suitable screenshot.
          </p>
          <RangeSetting
            label="Random"
            min={0}
            max={10}
            id="randomVal"
            name="randomVal"
            helpBlock="Screenshot completely chosen by random"
          />
          <RangeSetting
            label="Popular"
            min={0}
            max={10}
            id="popularVal"
            name="popularVal"
            helpBlock="Screenshots that have an above average likes/views ratio"
          />
          <RangeSetting
            label="Trending"
            min={0}
            max={10}
            id="trendingVal"
            name="trendingVal"
            helpBlock="Popular screenshots that have the highest likes/views ratio, regardless of age."
          />
          <RangeSetting
            label="Recent"
            min={0}
            max={10}
            id="recentVal"
            name="recentVal"
            helpBlock="Recently posted screenshots (up to a few days old)"
          />
          <RangeSetting
            label="Forgotten Ones"
            min={0}
            max={10}
            id="archeologistVal"
            name="archeologistVal"
            helpBlock="Screenshots that have not seen any activity for some time."
          />
          <RangeSetting
            label="Supporter"
            min={0}
            max={10}
            id="supporterVal"
            name="supporterVal"
            helpBlock="Screenshots from Hall of Fame's members that assist the platform's development (e.g.
                    donations, being a positive contributor to the platform)."
          />
        </section>
        <hr />
        <section id="about">
          <h3 className="fs-4 mb-3">About</h3>
          Hall of Fame Viewer v1.x.x
          <ul>
            <li>© 2026 foxxy (cloudgal42)</li>
            <li>
              <a
                href="https://github.com/cloudgal42/hof-viewer"
                target="_blank"
              >
                Source
              </a>
            </li>
            <li>
              <a
                href="https://github.com/cloudgal42/hof-viewer/blob/master/LICENSE"
                target="_blank"
              >
                LICENSE
              </a>
            </li>
            <li>
              <a
                href="https://mods.paradoxplaza.com/mods/90641/Windows"
                target="_blank"
              >
                Hall of Fame
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Settings;
