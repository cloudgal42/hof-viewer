
import {Fragment} from "react";
import type {City, GroupedCities} from "../../../interfaces/City.ts";

interface RenderSettingsProps {
  city: City | GroupedCities;
}

export const RenderSettings = ({city}: RenderSettingsProps) => {
  const settingCategories = [...new Set(Object.keys(city.renderSettings).map((key) => {
    const processedKey = key.split(".");
    return processedKey[0];
  }))];

  return (
    <div className="row">
      {Object.entries(city.renderSettings).length !== 0 ? (
        <>
          {settingCategories.map(category => (
            <details key={category} className="col-12 col-md-6" open>
              <summary key={`${category}Title`}>{category}</summary>
              <ul key={`${category}Details`}>
                {Object.entries(city.renderSettings).map(([key, value]) =>
                  <Fragment key={key}>
                    {key.includes(category) && (
                      <li key={key}>{`${key.split(".")[key.split(".").length - 1]}: ${value}`}</li>
                    )}
                  </Fragment>
                )}
              </ul>
            </details>
          ))}
        </>
        // <ul>
        //   {Object.entries(city.renderSettings).map(([key, value]) =>
        //     <li key={key}>{`${key}: ${value}`}</li>
        //   )}
        // </ul>
      ) : (
        <p>No render settings found.</p>
      )}
    </div>
  )
}