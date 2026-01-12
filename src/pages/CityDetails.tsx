import {Card} from "react-bootstrap";
import {useOutletContext, useParams} from "react-router";
import type {ContextType} from "../App.tsx";
import {Cake2, Person} from "react-bootstrap-icons";

export const CityDetails = () => {
  const params = useParams();

  const {
    cities,
  } = useOutletContext<ContextType>();

  const city = cities.find(city => city.cityName === params.city);

  if (!city) {
    return (
      <div>City not found</div>
    )
  } else {
    return (
      <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
        <h2>{city.cityName}</h2>
        <div className="mt-3"></div>
        <div className="mt-3">
          <Card>
            <Card.Body>
              <Card.Title>City Stats</Card.Title>
              <ul className="list-unstyled d-flex flex-row flex-wrap justify-content-between gap-2">
                <li className="d-flex align-items-center gap-2">
                  <Person/>
                  {city.cityPopulation.toLocaleString()}
                </li>
                <li className="d-flex align-items-center gap-2">
                  <Cake2 />
                  {city.createdAtFormatted}
                </li>
              </ul>
              <Card.Title>HoF Stats</Card.Title>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }
}

