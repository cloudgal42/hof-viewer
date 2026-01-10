import Form from "react-bootstrap/Form";

interface SortDropdownProps {
  setSortBy: (sortBy: string) => void;
}

export const SortDropdown = ({setSortBy}: SortDropdownProps) => {
  return (
    <Form.Select
      id="sortByDropdown"
      name="sortBy"
      aria-label="Sort By"
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option>Sort By</option>
      <option value="date">Date Posted</option>
      <option value="name">Name (Latinized)</option>
      <option value="population">Population</option>
      <option value="views">Views</option>
      <option value="favorites">Favorites</option>
    </Form.Select>
  )
}