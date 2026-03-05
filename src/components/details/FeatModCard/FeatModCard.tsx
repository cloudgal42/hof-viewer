import {Button, ButtonGroup, Card} from "react-bootstrap";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../../assets/placeholder.svg";

import type {Mod} from "../../../interfaces/Mod.ts";
import {ErrorScreen} from "../../misc/ErrorScreen/ErrorScreen.tsx";

import pdxModsIcon from "../../../assets/pdx-mods.webp";
import skyveIcon from "../../../assets/skyve.webp";
import {CardImg} from "../../misc/CardImg/CardImg.tsx";

interface ModCardProps {
  fetchError?: Error | null;
  showcasedMod: Mod;
}

export const FeatModCard = ({fetchError, showcasedMod}: ModCardProps) => {
  let content;

  if (fetchError) {
    content = (
      <Card>
        <ErrorScreen
          errorSummary="Failed to get showcased mod details :("
          errorDetails={fetchError.message}
        />
      </Card>
    )
  } else {
    content = (
      <Card className="row flex-md-row gx-0">
        <CardImg
          wrapperClassName="col-12 col-md-4 w-100 w-md-25"
          className="h-100 w-100 object-fit-cover"
          src={showcasedMod?.thumbnailUrl}
          style={{aspectRatio: "1/1"}}
          alt=""
          effect="black-and-white"
        />
        <Card.Body className="col-12 col-md-8">
          <h4>
            <Card.Title>
              {showcasedMod?.name}
              <span className="ms-2 text-muted" style={{fontSize: "0.9rem"}}>
              {showcasedMod?.subscribersCount.toLocaleString()} subscribers
            </span>
            </Card.Title>
          </h4>
          <Card.Subtitle className="text-muted mb-1">by {showcasedMod?.authorName}</Card.Subtitle>
          {/* TODO: add date range after version number */}
          <ul className="list-unstyled text-muted mb-1 d-inline-flex flex-wrap w-100">
            {showcasedMod?.tags && showcasedMod.tags.map((tag, i) =>
              <li key={i} className="me-2" style={{fontSize: "14px"}}>{tag}</li>
            )}
          </ul>
          <p className="mb-2 text-muted">{showcasedMod?.shortDescription}</p>
          <ButtonGroup>
            <Button
              variant="outline-primary"
              className="d-flex gap-2 align-items-center"
              href={`https://mods.paradoxplaza.com/mods/${showcasedMod?.paradoxModId}/Windows`}
              target="_blank"
            >
              <img src={pdxModsIcon} width="18" height="16" alt=""/>
              PDX Mods
              <BoxArrowUpRight width="14" height="14"/>
            </Button>
            <Button
              variant="outline-primary"
              className="d-flex gap-2 align-items-center"
              href={`https://skyve-mod.com/app/mods/${showcasedMod?.paradoxModId}`}
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

  return (
    <>
      {content}
    </>
  )
}
