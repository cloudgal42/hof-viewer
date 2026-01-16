import Form from "react-bootstrap/Form";
import {handleSetSearchParams} from "../utils/SearchParamHandlers.ts";

interface SortDropdownProps {
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}

export const SortDropdown = ({searchParams, setSearchParams}: SortDropdownProps) => {
  return (
    <Form.Select
      id="sortByDropdown"
      name="sortBy"
      aria-label="Sort By"
      onChange={(e) => {
        setSearchParams(handleSetSearchParams(searchParams, "sortBy", e.currentTarget.value));
      }}
    >
      <option value="date">Date Posted</option>
      <option value="name">Name (Latinized)</option>
      <option value="population">Population</option>
      <option value="views">Views</option>
      <option value="favorites">Favorites</option>
    </Form.Select>
  )
}