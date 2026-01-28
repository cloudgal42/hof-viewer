import {Card} from "react-bootstrap";
import {ArrowUpRight, Cake, Eye, Heart, Images} from "react-bootstrap-icons";
import {NavLink} from "react-router";

import type {CreatorDetails} from "../../interfaces/Creator.ts";

const Socials: {[key: string]: string} = {
  "discord": "Discord",
  "github": "GitHub",
  "kofi": "Ko-fi",
  "paradoxmods": "Paradox Mods",
  "paypal": "PayPal",
}

interface CreatorCardProps {
  creator: CreatorDetails;
}

export const CreatorCard = ({creator}: CreatorCardProps) => {
  return (
    <Card className="w-100">
      <Card.Body className="row">
        <div className="col-12 col-sm-6">
          <Card.Title>{creator.creatorName}</Card.Title>
          <Card.Subtitle>{creator.creatorNameLatinized}</Card.Subtitle>
          <p className="d-flex mb-2 gap-2 align-items-center">
            <Cake />
            <span className="visually-hidden">Created on</span>
            {new Date(creator.createdAt).toLocaleString()}
          </p>
          <Card.Title>Socials</Card.Title>
          <ul className="list-unstyled">
            {creator.socials.length > 0 ? creator.socials.map((social, i) =>
              <li key={i} className="d-md-inline me-md-2">
                <a key={i} href={social.link}>{Socials[social.platform.toString()]}</a>
              </li>
            ) : (
              <li>No socials account found.</li>
            )}
          </ul>
        </div>
        <div className="col-12 col-sm-6">
          <Card.Title>HoF Stats</Card.Title>
          <ul className="list-unstyled mb-2">
            <li className="d-flex gap-2 align-items-center">
              <Images />
              <span className="visually-hidden">Total Screenshots</span>
              {creator.screenshotsCount.toLocaleString()}
            </li>
            <li className="d-flex gap-2 align-items-center">
              <Eye />
              <span className="visually-hidden">Views</span>
              {creator.viewsCount.toLocaleString()} (Unique: {creator.uniqueViewsCount.toLocaleString()})
            </li>
            <li className="d-flex gap-2 align-items-center">
              <Heart />
              <span className="visually-hidden">Favorites</span>
              {`${creator.favoritesCount.toLocaleString()} (${Math.round((creator.favoritesCount / creator.viewsCount) * 100)}% of unique views)`}
            </li>
          </ul>
          <NavLink to={`/?creator=${creator.id}`} >
            To {creator.creatorName}'s cities
            <ArrowUpRight className="ms-2" />
          </NavLink>
        </div>
      </Card.Body>
    </Card>
  )
}