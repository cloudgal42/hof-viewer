import {SortDown, SortUp} from "react-bootstrap-icons";
import {Button} from "react-bootstrap";
import {handleSetSearchParams} from "../utils/SearchParamHandlers.ts";

interface SortOrderButtonProps {
  sortOrder: string;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}

export const SortOrderButton = ({sortOrder, searchParams, setSearchParams}: SortOrderButtonProps) => {
  function setOrder() {
    if (sortOrder === "Ascending") {
      setSearchParams(handleSetSearchParams(searchParams, "sortOrder", "Descending"));
    } else if (sortOrder === "Descending") {
      setSearchParams(handleSetSearchParams(searchParams, "sortOrder", "Ascending"));
    }
  }

  return (
    <Button
      variant="outline-primary"
      style={{borderColor: "lightgray"}}
      aria-label="Sort Order"
      onClick={setOrder}
    >
      {sortOrder === "Ascending" ? (
        <SortUp/>
      ) : (
        <SortDown/>
      )}
      <span className="visually-hidden">{sortOrder}</span>
    </Button>
  )
}