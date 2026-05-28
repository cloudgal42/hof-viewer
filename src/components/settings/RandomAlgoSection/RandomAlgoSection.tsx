import { RangeSetting } from "../SettingsComponents/RangeSetting.tsx";
import {useLocalStorage} from "usehooks-ts";
import type {RandomAlgoSettings} from "../../../interfaces/RandomAlgoSettings.ts";

export const RandomAlgoSection = () => {
  const [randomAlgoSettings, setRandomAlgoSettings]
    = useLocalStorage<RandomAlgoSettings>("randomAlgoSettings", {
    random: 5,
    popular: 10,
    trending: 10,
    recent: 10,
    archeologist: 0,
    supporter: 1,
    viewMaxAge: 60,
  });

  return (
    <section id="algoSettings">
      <h3 className="fs-4 mb-2">Random City Algorithm</h3>
      <p className="text-muted fw-normal">
        Change how should Hall of Fame (HoF) weigh the next random screenshot.
        Note that HoF may not respect these settings if it is unable to find a
        suitable screenshot.
      </p>
      <RangeSetting
        label="Random"
        min={0}
        max={10}
        id="randomVal"
        name="randomVal"
        helpBlock="Screenshot completely chosen by random"
        value={randomAlgoSettings.random}
        onChange={e => setRandomAlgoSettings({...randomAlgoSettings, random: parseInt(e.currentTarget.value)})}
      />
      <RangeSetting
        label="Popular"
        min={0}
        max={10}
        id="popularVal"
        name="popularVal"
        helpBlock="Screenshots that have an above average likes/views ratio"
        value={randomAlgoSettings.popular}
        onChange={e => setRandomAlgoSettings({...randomAlgoSettings, popular: parseInt(e.currentTarget.value)})}
      />
      <RangeSetting
        label="Trending"
        min={0}
        max={10}
        id="trendingVal"
        name="trendingVal"
        helpBlock="Popular screenshots that have the highest likes/views ratio, regardless of age."
        value={randomAlgoSettings.trending}
        onChange={e => setRandomAlgoSettings({...randomAlgoSettings, trending: parseInt(e.currentTarget.value)})}
      />
      <RangeSetting
        label="Recent"
        min={0}
        max={10}
        id="recentVal"
        name="recentVal"
        helpBlock="Recently posted screenshots (up to a few days old)"
        value={randomAlgoSettings.recent}
        onChange={e => setRandomAlgoSettings({...randomAlgoSettings, recent: parseInt(e.currentTarget.value)})}
      />
      <RangeSetting
        label="Forgotten Ones"
        min={0}
        max={10}
        id="archeologistVal"
        name="archeologistVal"
        helpBlock="Screenshots that have not seen any activity for some time."
        value={randomAlgoSettings.archeologist}
        onChange={e => setRandomAlgoSettings({...randomAlgoSettings, archeologist: parseInt(e.currentTarget.value)})}
      />
      <RangeSetting
        label="Supporter"
        min={0}
        max={10}
        id="supporterVal"
        name="supporterVal"
        helpBlock="Screenshots from Hall of Fame's members that assist the platform's development (e.g.
                    donations, being a positive contributor to the platform)."
        value={randomAlgoSettings.supporter}
        onChange={e => setRandomAlgoSettings({...randomAlgoSettings, supporter: parseInt(e.currentTarget.value)})}
      />
    </section>
  );
};
