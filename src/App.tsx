import './css/App.scss'
import {type City, CityCard} from "./components/CityCard.tsx";
import Form from "react-bootstrap/Form"
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {PlaceholderCard} from "./components/PlaceholderCard.tsx";

const App = () => {
  const [creator, setCurrCreator] = useState<string | undefined>();
  const [cities, setCities] = useState<City[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let content;

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
    content = cities.map(city =>
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
              <Button type="submit">Search</Button>
            </div>
            <Form.Text id="creatorIdHelpBlock">Must be 24 characters long.</Form.Text>
          </form>
        </section>
        <section>
          <div>
            <h2>Cities</h2>
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
