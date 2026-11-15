import {Fragment} from "react";
import type {City, GroupedCities} from "../../../../types/City.ts";
import {CircleFill} from "react-bootstrap-icons";
import {Conditions} from "../Conditions/Conditions.tsx";
import {isEmptyObject} from "../../../../utils/isEmptyObject.ts";

import "./RenderSettings.css";

interface RenderSettingsProps {
  city: City | GroupedCities;
}

function format(val: string) {
  return val
    .split(/(?=[A-Z])/)
    .map((word, i) => {
      if (word.includes("m_")) return "";
      const upperCasedWord = word.charAt(0).toUpperCase() + word.slice(1, word.length);
      return upperCasedWord.includes("/")
        ? `${upperCasedWord.split("/")[0]} (${upperCasedWord.split("/")[1].toUpperCase()})`
        : upperCasedWord
    })
    .join(" ");
}

export const RenderSettings = ({city}: RenderSettingsProps) => {
  const seen = new Set();
  const settingCategories = Object.keys(city.renderSettings)
    .flatMap(key => {
      const processedKey = key.split(".")[0];
      if (seen.has(processedKey)) return [];
      
      seen.add(processedKey);
      return {
        key: processedKey,
        properties: Object.entries(city.renderSettings).filter(([k]) => k.includes(key.split(".")[0]))
      }
    });
  
  let body;
  
  if (Object.entries(city.renderSettings).length === 0 && isEmptyObject(city.renderConditions)) {
    return <p>No screenshot conditions and render settings found.</p>
  } else if (Object.entries(city.renderSettings).length === 0) {
    body = <p>No render settings found.</p>
  } else {
    body = (
      <ul className={`list-unstyled ${settingCategories.length > 1 ? "render-settings-dual-col" : ""}`}>
        {settingCategories.map(category => (
          <li
            key={category.key}
            className="mb-2"
          >
            {/* Style tag needed to prevent title from breaking to next column */}
            <h4
              className="h6"
              key={`${category}Title`}
              style={{breakAfter: "avoid"}}
            >
              <CircleFill className="me-2" size={6}/>
              {format(category.key)}
            </h4>
            {/* The style tag is needed to prevent short categories from
                  unnecessarily break into the other column. */}
            <ul
              key={`${category.key}Details`}
              className="list-unstyled"
              style={{breakInside: category.properties.length < 3 ? "avoid" : "auto"}}
            >
              {category.properties.map(([key, value], i) =>
                <Fragment key={key}>
                  <li
                    key={key}
                    className={`border-top border-secondary-subtle ${i % 2 ? "bg-body-tertiary" : ""} p-2 d-flex align-items-center justify-content-between`}
                    style={{breakBefore: "avoid"}}
                  >
                    <span className="small">{format(key.split(".")[key.split(".").length - 1])}</span>
                    <span className="small fw-semibold">{value.toLocaleString()}</span>
                  </li>
                </Fragment>
              )}
            </ul>
          </li>
        ))}
      </ul>
    )
  }
  
  return (
    <>
      <Conditions renderConditions={city.renderConditions}/>
      <hr/>
      {body}
    </>
  )
}