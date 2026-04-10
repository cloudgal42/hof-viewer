import {Card, CloseButton} from "react-bootstrap";

import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import {ArrowUpRight, Eye, Heart, Person, SquareFill} from "react-bootstrap-icons";
import {useState} from "react";
import type {PercentageStat} from "../../../interfaces/PercentageStat.ts";
import {CardImg} from "../../misc/CardImg/CardImg.tsx";

interface ClickedCityCardProps {
  data: PercentageStat;
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
}

export const ClickedCityCard = ({data, visibility, setVisibility}: ClickedCityCardProps) => {
  if (visibility) {
    return (
      <Card className="mb-3 row flex-md-row gx-0 position-relative">
        <CardImg
          wrapperClassName="col-12 col-md-4 w-100 w-md-25"
          className="h-100 w-100 object-fit-cover"
          src={data.details.imageUrlFHD}
          style={{aspectRatio: "1/1"}}
          alt=""
          effect="black-and-white"
        />
        <Card.Body className="mb-2 col-auto">
          <h4>
            <SquareFill className="d-inline me-2" style={{color: data.backgroundColor}} />
            <Card.Title className="d-inline">{data.details.cityName}</Card.Title>
          </h4>
          <Card.Subtitle className="mb-2 text-muted">
            Posted on {new Date(data.details.createdAt).toLocaleString()}
          </Card.Subtitle>
          <Card.Text className="mb-2">
            {/* Round to 2d.p. */}
            ~ {Math.round(data.data[0] * 100) / 100}% of total
          </Card.Text>
          <ul className="list-unstyled mb-2">
            <li className="d-flex align-items-center gap-2">
              <Person/>
              <span className="visually-hidden">Population</span>
              {data.details.cityPopulation.toLocaleString()}
            </li>
            <li className="d-flex align-items-center gap-2">
              <Eye/>
              <span className="visually-hidden">Views</span>
              {data.details.viewsCount.toLocaleString()} (Unique: {data.details.uniqueViewsCount.toLocaleString()})
            </li>
            <li className="d-flex align-items-center gap-2">
              <Heart/>
              <span className="visually-hidden">Favorites</span>
              {data.details.favoritesCount.toLocaleString()}
            </li>
          </ul>
          <a
            href={`/city/${data.id}?groupStatus=off`}
            className="d-inline-flex gap-2 align-items-center"
            target="_blank"
          >
            View details <ArrowUpRight />
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