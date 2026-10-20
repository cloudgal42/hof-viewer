import { BoxArrowUpRight } from "react-bootstrap-icons";
import {CONFIG} from "../config/Config.ts";

const About = () => {
  return (
    <article className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <h2>About Hall of Fame Viewer</h2>
      <p>Current version: {CONFIG.appVersion}</p>
      <p>
        A React webapp that utilizes the{" "}
        <a
          href="https://mods.paradoxplaza.com/mods/90641/Windows"
          target="_blank"
        >
          Hall Of Fame (HoF) API <BoxArrowUpRight className="ms-1 mb-1" />
        </a>{" "}
        to allow users to browse and view city screenshots by creator name or
        ID.
      </p>
      <p>
        Features:
      </p>
      <ul>
        <li>Group screenshots by city name</li>
        <li>
          View screenshot details, such as views & favorites count, as well as
          city stats such as milestone and population.
        </li>
        <li>View, search and filter playset used.</li>
        <li>View render settings used for that screenshot.</li>
        <li>View count and favorite count trends graph</li>
        <li>Find which screenshot in a city is the most successful</li>
      </ul>
      <p>
        Source code accessible on{" "}
        <a href="https://github.com/cloudgal42/hof-viewer" target="_blank">
          GitHub <BoxArrowUpRight className="ms-1 mb-1" />
        </a>
      </p>
      <h3>Acknowledgements</h3>
      <ul>
        <li>
          <a href="https://github.com/toverux/" target="_blank">
            toverux <BoxArrowUpRight className="ms-1 mb-1" />
          </a>{" "}
          for the original Hall of Fame mod for Cities: Skylines 2
        </li>
      </ul>
      <h3>License</h3>
      <p>
        Licensed under GPLv3. Read more{" "}
        <a href="https://github.com/cloudgal42/hof-viewer/blob/master/LICENSE" target="_blank">
          here <BoxArrowUpRight className="ms-1 mb-1" />
        </a>
      </p>
    </article>
  );
};

export default About;
