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
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("Theme context is null");
  }

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  }, [])

  return (
    <div
      className="position-relative w-xl-70px ms-4 ms-sm-5 ms-lg-4 ms-xl-5 me-4 me-sm-5 flex-grow-1 d-flex flex-column flex-lg-row justify-content-center"
    >
      <SectionNav />
      <div className="settings-wrapper flex-grow-1">
        <section id="appearance">
          <h3 className="fs-4 mb-3">Appearance</h3>
          <ToggleSetting
            label="Dark Mode"
            id="darkMode"
            name="darkMode"
            helpBlock="Use dark mode for this website"
            checked={context.theme === "dark"}
            onChange={() => context.setIsDarkMode(context.theme !== "dark")}
          />
        </section>
        <hr />
        <GroupedCitiesSection />
        <hr />
        <TranslationSection />
        <hr />
        <RandomAlgoSection />
      </div>
    </div>
  );
};

export default Settings;
