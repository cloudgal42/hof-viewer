import {Card} from "react-bootstrap";
import PlaceholderImg from "../../assets/placeholder.svg";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import type {Mod} from "../../interfaces/Mod.ts";

import 'react-lazy-load-image-component/src/effects/black-and-white.css';

interface ModListProps {
  mod: Mod;
  isCompactMode: boolean;
}

export const ModCard = ({mod, isCompactMode}: ModListProps) => {
  return (
    <Card>
      {!isCompactMode &&
        <LazyLoadImage
          wrapperClassName="col-12 col-md-4 w-100"
          className="h-100 w-100 object-fit-cover"
          src={mod.thumbnailUrl}
          style={{aspectRatio: "1/1"}}
          alt=""
          effect="black-and-white"
          placeholder={
            <img src={PlaceholderImg} alt=""/>
          }
        />
      }
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="mb-1">
          <Card.Title className="mb-2">
            {mod.name}
          </Card.Title>
          <Card.Subtitle className="text-muted mb-1">{mod.authorName}</Card.Subtitle>
          <Card.Text className="text-muted">{mod.subscribersCount.toLocaleString()} subscribers</Card.Text>
        </div>
        <Card.Text style={{justifySelf: "end"}}>
          <a
            className="d-inline-flex flex-row gap-2 align-items-center"
            style={{overflowWrap: "anywhere"}}
            href={`https://mods.paradoxplaza.com/mods/${mod.paradoxModId}/Windows`}
            target="_blank"
          >
            View on PDX Mods
            <BoxArrowUpRight className="flex-grow-1" width="16" height="16"/>
          </a>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}