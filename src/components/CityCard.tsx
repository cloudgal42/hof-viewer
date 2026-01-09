import {Card} from "react-bootstrap";
import {Heart, Eye, Person} from "react-bootstrap-icons";

interface City {
  id: string;
  isApproved: boolean;
  isReported: boolean;
  favoritesCount: number;
  favoritingPercentage: number;
  viewsCount: number;
  uniqueViewsCount: number;
  cityName: string;
  cityNameLocale?: string;
  cityNameLatinized?: string;
  cityNameTranslated?: string;
  cityMilestone: number;
  cityPopulation: number;
  mapName?: string;
  description?: string;
  imageUrlThumbnail: string;
  imageUrlFHD: string;
  imageUrl4K: string;
  shareParadoxModIds: boolean;
  paradoxModIds: number[];
  shareRenderSettings: boolean;
  renderSettings: object; // FIXME: Maybe define an interface for this?
  createdAt: string;
  createdAtFormatted: string;
  createdAtFormattedDistance: string;
  creatorId: string;
  creator: Creator
  showcasedModId?: number;
  __favorited: boolean;
}

interface Creator {
  id: string;
  creatorName: string;
  creatorNameSlug: string;
  creatorNameLocale?: string;
  creatorNameLatinized?: string;
  creatorNameTranslated?: string;
  createdAt: string;
  socials: string[];
}

interface CityCardProps {
  city: City;
}

export const CityCard = ({city}: CityCardProps) => {
  return (
    <Card style={{flexBasis: "32.9%"}}>
      <Card.Img variant="top" src={city.imageUrlThumbnail}/>
      <Card.Body className="p-2">
        <Card.Title>{city.cityName}</Card.Title>
        <Card.Subtitle className="mb-1">{city.cityNameTranslated}</Card.Subtitle>
        <Card.Text className="d-flex gap-2 text-secondary" style={{fontSize: "0.9rem"}}>
          <span className="d-flex align-items-center">
            <Person/>
            <span className="ms-1">{city.cityPopulation}</span>
          </span>
          <span className="d-flex align-items-center">
            <Eye/>
            <span className="ms-1">{city.viewsCount}</span>
          </span>
          <span className="d-flex align-items-center">
            <Heart/>
            <span className="ms-1">{city.favoritesCount}</span>
          </span>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}