import {BackButton} from "../../misc/BackButton/BackButton.tsx";
import {CreatorPreviewTrigger} from "../../misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {useEffect, useState} from "react";

import "../../../css/components/AdaptiveHeader.scss";

export const AdaptiveHeader = (
  {cityDetails} : {cityDetails: City | GroupedCities}
) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  useEffect(() => {

    function checkScrollYPos() {
      if (window.scrollY >= 70) {
        setHeaderCollapsed(true);
      } else {
        setHeaderCollapsed(false);
      }
    }

    window.addEventListener("scroll", checkScrollYPos);

    return () => window.removeEventListener("scroll", checkScrollYPos);
  }, []);

  return (
    <div className={headerCollapsed ? " header-collapsed" : "adaptive-header"}>
      <div className="header-collapsed-body main-wrapper m-auto">
        <div className="h2-container d-flex align-items-center">
          <BackButton />
          <h2 className="mb-0">
            {cityDetails.cityName}{cityDetails.cityNameTranslated && `(${cityDetails.cityNameTranslated})`}
          </h2>
        </div>
        <CreatorPreviewTrigger
          creator={cityDetails.creator.creatorName}
          showLinks={true}
        >
          <h3 className="text-muted d-inline">by {cityDetails.creator.creatorName}</h3>
        </CreatorPreviewTrigger>
      </div>
    </div>
  )
}