import {SortAlphaDownAlt, SortAlphaUpAlt, SortDown, SortUp} from "react-bootstrap-icons";
import {Button} from "react-bootstrap";
import {handleSetSearchParams} from "../../../utils/SearchParamHandlers.ts";

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

  const isAlphabetSort = searchParams.get("sortBy") === "name";

  return (
    <Button
      variant="outline-primary"
      aria-label="Sort Order"
      onClick={setOrder}
    >
      {sortOrder === "Ascending" ? (
        isAlphabetSort ? (<SortAlphaUpAlt width="20" height="20" />) : (<SortUp width="20" height="20" />)
      ) : (
        isAlphabetSort ? (<SortAlphaDownAlt width="20" height="20" />) : (<SortDown width="20" height="20" />)
      )}
      <span className="visually-hidden">{sortOrder}</span>
    </Button>
  )
}