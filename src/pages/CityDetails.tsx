import {Button} from "react-bootstrap";
import {NavLink, useOutletContext, useParams, useSearchParams} from "react-router";
import type {ContextType} from "../App.tsx";
import {ChevronDown} from "react-bootstrap-icons";
import {lazy, Suspense, useEffect, useState} from "react";
import {DEFAULT_IMAGES_PER_PAGE} from "../components/details/CityGallery/CityGallery.tsx";

import PlaceholderImg from "../assets/placeholder.svg"
import {PlaceholderDetails} from "../components/details/Details/PlaceholderDetails.tsx";
import {CityTrends} from "../components/details/CityTrends/CityTrends.tsx";
import {ErrorScreen} from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import {useQuery} from "@tanstack/react-query";
import type {City} from "../interfaces/City.ts";
import {CityInsights} from "../components/details/CityInsights/CityInsights.tsx";
import {useCreatorCities} from "../hooks/useCreatorCities.ts";
import {groupCities} from "../utils/GroupCities.ts";

import {AdaptiveHeader} from "../components/details/AdaptiveHeader/AdaptiveHeader.tsx";
import {Details} from "../components/details/Details/Details.tsx";
import {BackButton} from "../components/misc/BackButton/BackButton.tsx";
import {CreatorPreviewTrigger} from "../components/misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import {AdaptiveHeaderProvider} from "../components/providers/AdaptiveHeaderProvider.tsx";
import {PlaceholderDetailsHeader} from "../components/details/Details/PlaceholderDetailsHeader.tsx";

const CityGallery = lazy(() => import("../components/details/CityGallery/CityGallery.tsx"));


const CityDetails = () => {
  const {
    city,
  } = useOutletContext<ContextType>();

  const [page, setPage] = useState<number>(1);
  const [isLoadMoreHovered, setIsLoadMoreHovered] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const cityParam = useParams().city;

  const isCitiesGrouped = searchParams.get("groupStatus") === "on";
  const cityCreator = searchParams.get("creator");
  const {
    data: creatorCities,
    error: creatorCitiesError,
    isFetching: isCreatorCitiesFetching
  } = useCreatorCities(cityCreator);

  // Scrolls to top whenever the city details page is loaded
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const {error, data, isFetching} = useQuery<City>({
    queryKey: ["city", {id: cityParam}],
    queryFn: async () => {
      // maybe FIXME?
      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/${cityParam}?favorites=true&views=true`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(!city?.favorites && !city?.views && !isCitiesGrouped ||
      city?.showcasedModId && !isCitiesGrouped || !isCitiesGrouped),
    retry: false,
  });

  const fetchError = error || creatorCitiesError;

  const cityDetails = data || city ||
    creatorCities && groupCities(creatorCities).find(entry => entry.cityName.toLowerCase() === cityParam?.toLowerCase());

  if (!cityDetails) {
    if (!navigator.onLine) {
      return (
        <ErrorScreen
          errorSummary="You are offline :("
          errorDetails="Double check your Internet connection and try again."
        />
      )
    } else if (fetchError) {
      return (
        <ErrorScreen
          errorSummary="Failed to load screenshot/city details :("
          errorDetails={
            <>
              <p className="mb-1">
                {fetchError.message}. Try searching in <NavLink to="/">Browse by Creator ID</NavLink>?
              </p>
            </>
          }
        />
      )
    } else if (isFetching || isCreatorCitiesFetching) {
      return (
        <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
          <PlaceholderDetailsHeader/>
          <PlaceholderDetails/>
        </div>
      );
    } else {
      // TODO: There has to be a better solution to this
      return (
        <ErrorScreen
          errorSummary="Failed to load screenshot/city details :("
          errorDetails={
            <>
              <p className="mb-1">
                Cannot find city with the name "{cityParam}" by creator "{cityCreator}". Try searching in <NavLink
                to="/">Browse by Creator ID</NavLink>?
              </p>
            </>
          }
        />
      );
    }
  }

  const imageUrlFHD = !Array.isArray(cityDetails.imageUrlFHD) ? [cityDetails.imageUrlFHD] : cityDetails.imageUrlFHD;
  const isLastPage = (Math.ceil(imageUrlFHD.length / DEFAULT_IMAGES_PER_PAGE) - page) === 0;

  return (
    <div className="flex-grow-1">
      <AdaptiveHeaderProvider>
        <AdaptiveHeader>
          <div className="h2-container d-flex align-items-center">
            <BackButton/>
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
        </AdaptiveHeader>
      </AdaptiveHeaderProvider>
      <div className="main-wrapper m-auto">
        <section id="gallery" className="mt-3 position-relative">
          <Suspense fallback={<img
            src={PlaceholderImg}
            alt=""
            className="w-100"
            style={{aspectRatio: "16/9"}}/>}>
            <CityGallery page={page} city={cityDetails}/>
          </Suspense>
          {/* TODO: Move this button to the CityGallery component. Research React's useContext hook */}
          {!isLastPage && (
            <Button
              variant="outline"
              style={{border: "none", backgroundColor: "transparent"}}
              className="p-0 d-flex justify-content-center position-relative m-auto mt-3"
              id="loadMoreBtn"
              onClick={() => setPage(page + 1)}
              onMouseEnter={() => setIsLoadMoreHovered(true)}
              onMouseLeave={() => setIsLoadMoreHovered(false)}
            >
              <p className="mb-0">Load More</p>
              <ChevronDown width="24" height="24"/>
            </Button>
          )}
        </section>
        <section
          id="details"
          className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}
        >
          <Details cityDetails={cityDetails} error={error} isFetching={isFetching}/>
        </section>
        <section
          id="trends"
          className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}
        >
          <CityTrends city={cityDetails} isLoading={isFetching} fetchError={error}/>
        </section>
        {/* City insights only available for grouped screenshots */}
        {("cities" in cityDetails) && (
          <section
            id="insights"
            className={`mt-3 position-relative ${(isLoadMoreHovered && !isLastPage) && "load-more-hovered"}`}
          >
            <CityInsights city={cityDetails}/>
          </section>
        )}
      </div>
    </div>
  )

}
export default CityDetails

