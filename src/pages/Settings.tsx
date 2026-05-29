import { ToggleSetting } from "../components/settings/SettingsComponents/ToggleSetting.tsx";
import { SectionNav } from "../components/settings/SectionNav/SectionNav.tsx";
import {TranslationSection} from "../components/settings/TranslationSection/TranslationSection.tsx";
import {RandomAlgoSection} from "../components/settings/RandomAlgoSection/RandomAlgoSection.tsx";
import {GroupedCitiesSection} from "../components/settings/GroupedCitiesSection/GroupedCitiesSection.tsx";
import {useOutletContext} from "react-router";
import {ThemeContext} from "../context/ThemeContext.ts";
import {useContext, useEffect} from "react";
import type {ContextType} from "../App.tsx";

const Settings = () => {
  const {setIsDarkMode} = useOutletContext<ContextType>();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  }, [])

  return (
    <div className="ms-4 ms-sm-5 ms-lg-4 ms-xl-5 me-4 me-sm-5 flex-grow-1 d-flex flex-column flex-lg-row justify-content-center">
      <SectionNav />
      <div className="settings-wrapper flex-grow-1">
        <section id="appearance">
          <h3 className="fs-4 mb-3">Appearance</h3>
          <ToggleSetting
            label="Dark Mode"
            id="darkMode"
            name="darkMode"
            helpBlock="Use dark mode for this website"
            checked={theme === "dark"}
            onChange={() => setIsDarkMode(theme !== "dark")}
          />
        </section>
        <hr />
        <GroupedCitiesSection />
        <hr />
        <TranslationSection />
        <hr />
        <RandomAlgoSection />
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
