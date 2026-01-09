import './css/App.scss'
import {type City, CityCard} from "./components/CityCard.tsx";
import Form from "react-bootstrap/Form"
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";

const App = () => {
  const [creator, setCurrCreator] = useState<string | undefined>();
  const [cities, setCities] = useState<City[] | []>([]);

  function setCreator(formData: FormData) {
    const query = formData.get("creatorId");
    const queryString = query?.toString();
    setCurrCreator(queryString);
  }

  useEffect(() => {
    let ignore = false;
    if (!creator) return;

    async function getCreatorCities()  {
      const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`);

      const data = await res.json();

      if (res.ok && !ignore) {
        setCities(data);
      }
    }

    getCreatorCities();

    return () => {
      ignore = true
    };
  }, [creator]);

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
            {cities.length > 0 ? (
              cities.map(city =>
                <CityCard key={city.id} city={city} />
              )
            ) : (
              <p>No cities found</p>
            )
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default App
