import {SortDown, SortUp} from "react-bootstrap-icons";
import {Button} from "react-bootstrap";
import type {SortOrder} from "../App.tsx";

interface SortOrderButtonProps {
  sortOrder: SortOrder;
  setSortOrder: (sortOrder: SortOrder) => void;
}

export const SortOrderButton = ({sortOrder, setSortOrder}: SortOrderButtonProps) => {
  function setOrder() {
    if (sortOrder === "Ascending") setSortOrder("Descending");
    else if (sortOrder === "Descending") setSortOrder("Ascending");
  }

  return (
    <Button
      variant="outline-dark"
      style={{borderColor: "lightgray"}}
      aria-label="Sort Order"
      onClick={setOrder}
    >
      {sortOrder === "Ascending" ? (
        <SortUp />
      ) : (
        <SortDown />
      )}
      <span className="visually-hidden">{sortOrder}</span>
    </Button>
  )
}