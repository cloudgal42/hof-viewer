import {CloudHail, CloudRain, Clouds, Moon, Snow, Sun, Thunderbolt} from "react-bootstrap-icons";
import type {RenderConditions} from "../../../interfaces/City.ts";
import {fromDecimalTime} from "../../../utils/TimeFormat.ts";
import {isEmptyObject} from "../../../utils/IsEmptyObject.ts";

export const Conditions = (
  {renderConditions}: { renderConditions: RenderConditions }
) => {
  if (isEmptyObject(renderConditions)) return <p>No condition settings found.</p>;
  
  return (
    <div className="d-flex align-items-center gap-2">
      {renderConditions["climate.weather"] === "Clear"
        ? renderConditions["light.dayPhase"] ===
        "Night"
          ? <Moon size={24}/>
          : <Sun size={24}/>
        : ["Few", "Scattered"].includes(
          renderConditions["climate.weather"],
        )
          ? <Clouds size={24}/>
          : renderConditions["climate.isSnowing"]
            ? <Snow size={24}/>
            : renderConditions["climate.isRaining"]
              ? renderConditions["climate.weather"] ===
              "Storm"
                ? <Thunderbolt size={24}/>
                : renderConditions["climate.weather"] ===
                "Hail"
                  ? <CloudHail size={24}/>
                  : <CloudRain size={24}/>
              : ""}
      <div>
        <h4 className="fs-6 mb-1">
          {renderConditions["climate.season"].replace(
            "Season",
            "",
          )}
          {" · "}
          {renderConditions["climate.weather"]}
          {" · "}
          {Math.round(
            renderConditions["climate.temperature"],
          )}°C
        </h4>
        <small className="text-secondary-emphasis">
          {fromDecimalTime(renderConditions["time.hour"])}
          {" · "}
          {renderConditions["map.latitude"]
            .toPrecision(4)}°N
        </small>
      </div>
    </div>
  
  )
}