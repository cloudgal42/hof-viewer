import {Card, CloseButton} from "react-bootstrap";
import type {City} from "../../../interfaces/City.ts";
import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../../assets/placeholder.svg";

import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import {BoxArrowUpRight, Eye, Heart, Person} from "react-bootstrap-icons";
import {useState} from "react";

interface ClickedCityCardProps {
  city: City;
}

export const ClickedCityCard = ({city}: ClickedCityCardProps) => {
  const [visibility, setVisibility] = useState(true);

  if (visibility) {
    return (
      <Card className="row flex-md-row gx-0 position-relative">
        <LazyLoadImage
          wrapperClassName="col-12 col-md-4 w-100 w-md-25"
          className="h-100 w-100 object-fit-cover"
          src={city.imageUrlFHD}
          style={{aspectRatio: "1/1"}}
          alt=""
          effect="black-and-white"
          placeholder={
            <img src={PlaceholderImg} alt=""/>
          }
        />
        <Card.Body className="mb-2 col-auto">
          <h4>
            <Card.Title>{city.cityName}</Card.Title>
          </h4>
          <Card.Subtitle className="mb-2 text-muted">
            Posted on {new Date(city.createdAt).toLocaleString()}
          </Card.Subtitle>
          <ul className="list-unstyled mb-2">
            <li className="d-flex align-items-center gap-2">
              <Person/>
              {city.cityPopulation.toLocaleString()}
            </li>
            <li className="d-flex align-items-center gap-2">
              <Eye/>
              {city.viewsCount.toLocaleString()} (Unique: {city.uniqueViewsCount.toLocaleString()})
            </li>
            <li className="d-flex align-items-center gap-2">
              <Heart/>
              {city.favoritesCount.toLocaleString()}
            </li>
          </ul>
          <a
            href={`/city/${city.id}?groupStatus=off`}
            className="d-inline-flex gap-2 align-items-center"
            target="_blank"
          >
            View details <BoxArrowUpRight />
          </a>
        </Card.Body>
        <CloseButton
          className="position-absolute"
          aria-label="Close"
          style={{top: "0.5rem", right: "0.5rem"}}
          onClick={() => setVisibility(false)}
        />
      </Card>
    )
  }
}