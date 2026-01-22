import {Card} from "react-bootstrap";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../assets/placeholder.svg";

import SadChirper from "../../assets/sadChirpyOutline.svg";
import type {Mod} from "../home/CityCard.tsx";

interface ModCardProps {
  fetchStatus?: number;
  showcasedMod?: Mod;
}

export const FeatModCard = ({fetchStatus, showcasedMod}: ModCardProps) => {
  let content;

  if (fetchStatus !== 200) {
    content = (
      <Card>
        <div className="text-center m-auto my-3">
          <img
            width="128"
            height="128"
            src={SadChirper}
            alt=""
          />
          <p className="mb-1 text-muted">Failed to get mod data from PDX Mods :(</p>
          <p className="mb-1 text-muted">
            {fetchStatus === 404 ? "The asset/map no longer exists." : `HTTP Status: ${fetchStatus}. Please wait for a moment and try again.`}
          </p>
        </div>
      </Card>
    )
  } else {
    content = (
      <Card className="row flex-md-row gx-0">
        <LazyLoadImage
          wrapperClassName="col-12 col-md-4 w-100 w-md-25"
          className="h-100 w-100 object-fit-cover"
          src={showcasedMod?.thumbnailUrl}
          style={{aspectRatio: "1/1"}}
          alt=""
          effect="black-and-white"
          placeholder={
            <img src={PlaceholderImg} alt=""/>
          }
        />
        <Card.Body className="col-12 col-md-8">
          <Card.Title>
            <a href={`https://mods.paradoxplaza.com/mods/${showcasedMod?.paradoxModId}/Windows`} target="_blank"
               className="d-inline-flex gap-2 me-2 align-items-center">
              {showcasedMod?.name}
              <BoxArrowUpRight width="16" height="16"/>
            </a>
            <span className="text-muted" style={{fontSize: "0.9rem"}}>
              {showcasedMod?.subscribersCount.toLocaleString()} subscribers
            </span>
          </Card.Title>
          <Card.Subtitle className="text-muted mb-1">by {showcasedMod?.authorName}</Card.Subtitle>
          {/* TODO: add date range after version number */}
          <ul className="list-unstyled text-muted mb-1 d-inline-flex flex-wrap w-100">
            {showcasedMod?.tags && showcasedMod.tags.map((tag, i) =>
              <li key={i} className="me-2" style={{fontSize: "14px"}}>{tag}</li>
            )}
          </ul>

          <p className="mb-0 text-muted">{showcasedMod?.shortDescription}</p>
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
