import {Button, ButtonGroup, Card} from "react-bootstrap";
import PlaceholderImg from "../../../assets/placeholder.svg";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import type {Mod} from "../../../interfaces/Mod.ts";

import pdxModsIcon from "../../../assets/pdx-mods.png";
import skyveIcon from "../../../assets/skyve.ico";
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
        <div className="mb-2">
          <h4>
            <Card.Title className="mb-2">{mod.name}</Card.Title>
          </h4>
          <Card.Subtitle className="text-muted mb-1">{mod.authorName}</Card.Subtitle>
          <Card.Text className="text-muted">{mod.subscribersCount.toLocaleString()} subscribers</Card.Text>
        </div>
        <ButtonGroup vertical>
          <Button
            variant="outline-primary"
            className="d-flex gap-2 align-items-center"
            href={`https://mods.paradoxplaza.com/mods/${mod.paradoxModId}/Windows`}
            target="_blank"
          >
            <img src={pdxModsIcon} width="18" height="16" alt=""/>
            PDX Mods
            <BoxArrowUpRight width="14" height="14"/>
          </Button>
          <Button
            variant="outline-primary"
            className="d-flex gap-2 align-items-center"
            href={`https://skyve-mod.com/app/mods/${mod.paradoxModId}`}
            target="_blank"
          >
            <img src={skyveIcon} width="18" height="18" alt=""/>
            Skyve
            <BoxArrowUpRight width="14" height="14"/>
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  )
}