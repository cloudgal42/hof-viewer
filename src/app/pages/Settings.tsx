import { ToggleSetting } from "../../features/settings/components/SettingsComponents/ToggleSetting.tsx";
import { SectionNav } from "../../features/settings/components/SectionNav/SectionNav.tsx";
import {TranslationSection} from "../../features/settings/components/TranslationSection/TranslationSection.tsx";
import {RandomAlgoSection} from "../../features/settings/components/RandomAlgoSection/RandomAlgoSection.tsx";
import {GroupedCitiesSection} from "../../features/settings/components/GroupedCitiesSection/GroupedCitiesSection.tsx";
import {ThemeContext} from "../../context/ThemeContext.ts";
import {useContext, useEffect} from "react";

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
