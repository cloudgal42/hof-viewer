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
    <div className="col-6 col-md-4">
      <Card>
        <Card.Img variant="top" src={city.imageUrlThumbnail}/>
        <Card.Body>
          <Card.Title>{city.cityName}</Card.Title>
          <Card.Subtitle className="mb-1">{city.cityNameTranslated}</Card.Subtitle>
          <div style={{fontSize: "0.9rem"}} className="text-muted">
            <Card.Text className="d-block mb-1">by {city.creator.creatorName}</Card.Text>
            <Card.Text className="d-flex gap-2">
            <span className="d-flex align-items-center">
              <Person/>
              <span className="ms-1">{city.cityPopulation.toLocaleString()}</span>
            </span>
              <span className="d-flex align-items-center">
              <Eye/>
              <span className="ms-1">{city.viewsCount.toLocaleString()}</span>
            </span>
              <span className="d-flex align-items-center">
              <Heart/>
              <span className="ms-1">{city.favoritesCount.toLocaleString()}</span>
            </span>
            </Card.Text>
          </div>
        </Card.Body>
        <Card.Footer>
          <span className="text-muted" style={{fontSize: "0.9rem"}}>{city.createdAtFormattedDistance}</span>
        </Card.Footer>
      </Card>
    </div>

  )
}