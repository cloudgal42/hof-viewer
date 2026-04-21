import { Form } from "react-bootstrap";
import {GroupedCityRow} from "./GroupedCityRow.tsx";
import {AddGroup} from "./AddGroup.tsx";

export const GroupedCitiesSection = () => {


  return (
    <section id="groupedCities">
      <h3 className="fs-4 mb-2">Grouped Cities</h3>
      <p className="text-muted">
        Adjust or override the behavior of the screenshot grouping algorithm
      </p>
      <section className="mb-3">
        <Form.Control
          placeholder="(Optional) Enter creator name/ID for city names..."
          aria-label="(Optional) Enter creator name/ID for city names..."
        />
      </section>

      <section id="groupedCitiesSettingsEntries">
        <GroupedCityRow
          ungroupedCityNames={[
            {name: "Hsingang, Jing'an", isEditable: false},
            {name: "三谷市", isEditable: false},
            {name: "Linden City", isEditable: true},
          ]}
          groupedCityName="靜安市"
          translatedGroupedCityName="Jing'an City"
        />
        <hr/>
        <GroupedCityRow
          ungroupedCityNames={[
            {name: "Germania,New Ferryport", isEditable: false},
            {name: "Germania,old Shipyard", isEditable: false},
          ]}
          groupedCityName="Germania"
        />
        <AddGroup />
      </section>
    </section>
  );
};
