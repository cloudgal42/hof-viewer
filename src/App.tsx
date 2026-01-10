import './css/App.scss'
import {type City, CityCard} from "./components/CityCard.tsx";
import Form from "react-bootstrap/Form"
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {PlaceholderCard} from "./components/PlaceholderCard.tsx";
import {SortOrderButton} from "./components/SortOrderButton.tsx";
import {SortDropdown} from "./components/SortDropdown.tsx";

export type SortOrder = "Ascending" | "Descending";

const App = () => {
  const [creator, setCurrCreator] = useState<string | undefined>();
  const [cities, setCities] = useState<City[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [sortOrder, setSortOrder] = useState<SortOrder>("Ascending");
  const [sortBy, setSortBy] = useState("date");

  let content;
  const sortedCities = [...cities];

  function setCreator(formData: FormData) {
    const query = formData.get("creatorId");
    const queryString = query?.toString();
    setCurrCreator(queryString);
  }

  useEffect(() => {
    let ignore = false;
    if (!creator) return;

    async function getCreatorCities() {
      setIsLoading(true);
      const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`);
      const data = await res.json();

      if (res.ok && !ignore) {
        setCities(data);
        setIsLoading(false);
      } else {
        setCities([]);
        setIsLoading(false);
      }

    }

    getCreatorCities();

    return () => {
      ignore = true
    };
  }, [creator]);

  switch (sortBy) {
    // Sort descending by default
    case "date":
      sortedCities.sort((a, b) => {
        const cityADate = new Date(a.createdAt).getTime();
        const cityBDate = new Date(b.createdAt).getTime();

        if (cityADate < cityBDate) {
          return 1;
        } else if (cityADate > cityBDate) {
          return -1;
        }

        return 0;
      });
      break;
    case "name":
      break;
    case "population":
      sortedCities.sort((a, b) => b.cityPopulation - a.cityPopulation);
      break;
    case "views":
      sortedCities.sort((a, b) => b.viewsCount - a.viewsCount);
      break;
    case "favorites":
      sortedCities.sort((a, b) => b.favoritesCount - a.favoritesCount);
      break;
  }

  if (sortOrder === "Ascending") sortedCities.reverse();

  if (isLoading) {
    content = (
      <>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
        <PlaceholderCard/>
      </>
    )
  } else if (cities.length > 0) {
    content = sortedCities.map(city =>
      <CityCard key={city.id} city={city}/>
    );
  } else {
    content = <p>No cities found.</p>
  }

  // TODO: Migrate all regular bootstrap classes with react-bootstrap
  return (
    <>
      <div className="container-lg mt-3">
        <h1>Hall of Fame Feed</h1>
        <section className="mt-3 mb-3">
          <Form.Label htmlFor="creatorId">Enter the Creator ID:</Form.Label>
          <form action={setCreator}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                name="creatorId"
                id="creatorId"
                aria-describedby="creatorIdHelpBlock"
                placeholder="Creator ID..."
              />
              <Button type="submit" variant="dark">Search</Button>
            </div>
            <Form.Text id="creatorIdHelpBlock">Must be 24 characters long.</Form.Text>
          </form>
        </section>
        <section>
          <div className="d-flex mb-3 align-items-center justify-content-between">
            <h2 className="mb-0">Cities</h2>
            <div className="d-flex gap-2">
              <SortOrderButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
              <SortDropdown setSortBy={setSortBy} />
              {/*<DropdownButton id="dropdown-item-button" title="Sort By" variant="outline-dark">*/}
              {/*  <Dropdown.Item as="button">Date Posted</Dropdown.Item>*/}
              {/*  <Dropdown.Item as="button">Name (Latinized)</Dropdown.Item>*/}
              {/*  <Dropdown.Item as="button">Population</Dropdown.Item>*/}
              {/*  <Dropdown.Item as="button">Views</Dropdown.Item>*/}
              {/*  <Dropdown.Item as="button">Favorites</Dropdown.Item>*/}
              {/*</DropdownButton>*/}
            </div>
          </div>
          <div id="city-feed" className="row gx-2 gy-2">
            {content}
          </div>
        </section>
      </div>
    </>
  )
}

export default App
