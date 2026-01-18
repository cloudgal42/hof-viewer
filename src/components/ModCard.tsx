import {Card} from "react-bootstrap";
import {BoxArrowUpRight} from "react-bootstrap-icons";
import {useEffect, useState} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../assets/placeholder.svg";
import {PlaceholderModCard} from "./PlaceholderModCard.tsx";
// import {mod} from "../temp/mod.ts";

interface ModMetadata {
  size_in_memory: string;
  relevance_score: string;
}

interface ModChangelogItem {
  modVersion: number;
  released: string;
  details: string;
  size: number;
  userModVersion: string;
}

interface ModRequirements {
  productType: string;
  id: string;
  name: string;
  version: number,
  // TODO: Double check this type, might be incorrect
  dependencyVersion?: number,
}

interface ModScreenshotsItem {
  image: string;
  thumbnail: string;
}

interface ModActions {
  canEdit: boolean;
}

interface ModExternalLinksItem {
  url: string;
  type: string;
  displayName: null;
}

interface Mod {
  arch: string;
  author: string;
  background: string;
  displayName: string;
  // enabled: boolean;
  forumLink?: string;
  latestVersion: number;
  creationDate: string;
  longDescription: string;
  metadata: ModMetadata;
  os: string;
  preferredVersion: string;
  rating: number;
  ratingsTotal: number;
  hasLiked: boolean;
  requiredVersion: string;
  shortDescription: string;
  state: string;
  latestUpdate: string;
  updating: boolean;
  hasActiveAppeal: boolean;
  acl: string;
  name: string;
  modId: string;
  modVersion: string;
  userModVersion: string;
  changelog: ModChangelogItem[];
  displayImagePath: string;
  game: string;
  // installedActivationSets: any[];
  repositoryPath: string;
  requirements: ModRequirements[];
  screenshots: ModScreenshotsItem[];
  subscriptions: number;
  actions: ModActions;
  tags: string[];
  thirdPartyLinks?: string[];
  externalLinks: ModExternalLinksItem[];
  forumLinks?: string[];
  isRegionBlocked: boolean;
}

interface ModCardProps {
  modId: number;
}

const ModCard = ({modId}: ModCardProps) => {
  const [showcasedMod, setShowcasedMod] = useState<Mod>();
  const [isLoadingMod, setIsLoadingMod] = useState<boolean>(false);

  let content;

  useEffect(() => {
    let ignore = false;
    if (!modId) return;

    // console.log("Fetching mod data")

    async function getModData() {
      setIsLoadingMod(true);
      // OS is Windows for now since CS2 is Windows only
      const res = await fetch(`https://api.paradox-interactive.com/mods?modId=${modId}&os=Windows`);
      const data = await res.json();

      // const data = JSON.parse(mod);
      // const res = {ok: true}

      if (res.ok && !ignore) {
        setIsLoadingMod(false);
        setShowcasedMod(data.modDetail);
      }
    }

    getModData();

    return () => {
      ignore = true
    };

  }, [modId]);

  if (isLoadingMod) {
    content = <PlaceholderModCard />
  } else {
    content = (
      <Card className="row flex-md-row gx-0">
        <LazyLoadImage
          wrapperClassName="col-12 col-md-4 w-100 w-md-25"
          className="w-100 object-fit-cover"
          src={showcasedMod?.displayImagePath}
          alt=""
          effect="black-and-white"
          placeholder={
            <img src={PlaceholderImg} alt="" />
          }
        />
        <Card.Body className="col-12 col-md-8">
          <Card.Title>
            <a href={`https://mods.paradoxplaza.com/mods/${showcasedMod?.modId}/Windows`} target="_blank"
               className="d-inline-flex gap-2 me-2 align-items-center">
              {showcasedMod?.displayName}
              <BoxArrowUpRight width="16" height="16"/>
            </a>
            <span className="text-muted" style={{fontSize: "14px"}}>latest: {showcasedMod?.userModVersion}</span>
          </Card.Title>
          <Card.Subtitle className="text-muted mb-1">by {showcasedMod?.author}</Card.Subtitle>
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

export default ModCard;