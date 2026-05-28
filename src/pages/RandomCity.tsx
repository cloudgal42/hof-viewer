import { AdaptiveHeader } from "../components/details/AdaptiveHeader/AdaptiveHeader.tsx";
import { AdaptiveHeaderProvider } from "../providers/AdaptiveHeaderProvider.tsx";
import { Suspense, useContext, useEffect, useState } from "react";
import { AdaptiveHeaderContext } from "../context/AdaptiveHeaderContext.ts";
import { Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MoreActionsBtn } from "../components/misc/MoreActionsBtn/MoreActionsBtn.tsx";
import {
  ArrowUpRight,
  Building,
  ChevronLeft,
  ChevronRight,
  Gear,
  Person,
  Share,
} from "react-bootstrap-icons";
import type { City } from "../interfaces/City.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorScreen } from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import { PlaceholderDetails } from "../components/details/Details/PlaceholderDetails.tsx";
import PlaceholderImg from "../assets/placeholder.svg";
import { Details } from "../components/details/Details/Details.tsx";
import CityGallery from "../components/details/CityGallery/CityGallery.tsx";
import { CreatorPreviewTrigger } from "../components/misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import {
  PlaceholderHeaderWithControls,
} from "../components/randomcity/PlaceholderHeaderWithControls/PlaceholderHeaderWithControls.tsx";
import { shareContent } from "../utils/ShareContent.ts";
import { useLocalStorage } from "usehooks-ts";
import type { RandomAlgoSettings } from "../interfaces/RandomAlgoSettings.ts";
import { useScrollToTop } from "../hooks/useScrollToTop.ts";
import { DefaultHelmet } from "../components/misc/DefaultHelmet/DefaultHelmet.tsx";
import { NavLink, useOutletContext } from "react-router";
import type { ContextType } from "../App.tsx";
import type {TranslationSettings} from "../interfaces/TranslationSettings.ts";

const RandomCity = () => {
  const headerCollapsed = useContext(AdaptiveHeaderContext);
  const [page, setPage] = useState<number>(0);
  const [randomAlgoSettings] = useLocalStorage<RandomAlgoSettings>(
    "randomAlgoSettings",
    {
      random: 5,
      popular: 10,
      trending: 10,
      recent: 10,
      archeologist: 0,
      supporter: 1,
      viewMaxAge: 60,
    },
  );

  const [translationSettings] = useLocalStorage<TranslationSettings>(
    "translationSettings",
    {
      displayCityNames: "both",
      translateCityType: "transliterate",
      translateCreatorType: "transliterate",
    }
  );

  const { startGc, gcCount } = useOutletContext<ContextType>();
  const queryClient = useQueryClient();

  // Restart garbage collector countdown when
  // - User enters this page
  // - User loads the new page
  useEffect(() => {
    startGc();
  }, [startGc, page]);

  useEffect(() => {
    // Since page is not a derived value from gcCount, this is fine?
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (gcCount > 0) setPage(0);
  }, [gcCount, setPage]);

  const { data, isFetching, error } = useQuery<City>({
    queryKey: ["randomCity", page],
    queryFn: fetchRandomCity,
    staleTime: Infinity,
    retry: false,
    enabled: true,
    gcTime: Infinity,
  });

  // Optimistically fetch the next random city data as well as images for a snappier UX
  queryClient.fetchQuery<City>({
    queryKey: ["randomCity", page + 1],
    queryFn: fetchRandomCity,
    staleTime: Infinity,
    retry: false,
    gcTime: Infinity,
  }).then((data) => {
    const img = new Image();
    img.src = data.imageUrlFHD;
  });

  async function fetchRandomCity() {
    const options = {
      random: randomAlgoSettings.random,
      popular: randomAlgoSettings.popular,
      trending: randomAlgoSettings.trending,
      recent: randomAlgoSettings.recent,
      archeologist: randomAlgoSettings.archeologist,
      supporter: randomAlgoSettings.supporter,
      viewMaxAge: randomAlgoSettings.viewMaxAge,
    };

    const convertedOptions: string[][] = Object.entries(options)
      .map(([key, value]) => [key, value.toString()]);
    const query = new URLSearchParams(convertedOptions).toString();
    const res = await fetch(
      `${import.meta.env.VITE_HOF_SERVER}/screenshots/weighted?${query}`,
    );
    const data = await res.json();

    if (!res.ok) {
      return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
    }

    return data;
  }

  useScrollToTop();

  if (!navigator.onLine) {
    return (
      <ErrorScreen
        errorSummary="Failed to get random screenshots :("
        errorDetails="Double check your internet connection and try again."
      />
    );
  } else if (error) {
    return (
      <ErrorScreen
        errorSummary="Failed to get random screenshots :("
        errorDetails={error.message}
      />
    );
  } else if (isFetching || !data) {
    return (
      <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
        <PlaceholderHeaderWithControls />
        <PlaceholderDetails />
      </div>
    );
  }

  const creatorName = (translationSettings.translateCreatorType === "translate")
    ? data.creator.creatorNameTranslated || data.creator.creatorName
    : (translationSettings.translateCreatorType === "transliterate")
    ? data.creator.creatorNameLatinized || data.creator.creatorName
    : data.creator.creatorName;

  const cityName = (translationSettings.translateCityType === "translate")
    ? data.cityNameTranslated || data.cityName
    : (translationSettings.translateCityType === "transliterate")
    ? data.cityNameLatinized || data.cityName
    : data.cityName;

  return (
    <div className="flex-grow-1">
      <DefaultHelmet />
      <AdaptiveHeaderProvider>
        <AdaptiveHeader className="header-collapsed-body w-100 d-flex flex-row align-items-center justify-content-between">
          <Button
            variant="outline"
            onClick={() => setPage((a) => a - 1)}
            disabled={page === 0}
          >
            <span className="visually-hidden">To previous city</span>
            <OverlayTrigger overlay={<Tooltip>To previous city</Tooltip>}>
              <ChevronLeft width="20" height="20" />
            </OverlayTrigger>
          </Button>
          <div className="d-flex gap-2 gap-sm-3 flex-row align-items-center justify-content-between">
            <div className="h2-container mb-0 d-flex flex-wrap flex-column flex-sm-row justify-content-center align-items-center gap-1 gap-sm-0">
              <h2 className="mb-0 me-2 text-center flex-grow-1">{cityName}</h2>
              <CreatorPreviewTrigger
                creator={data.creator}
                creatorName={creatorName}
                showLinks={true}
              >
                <h3 className="text-muted text-center text-sm-start mb-0 d-inline">
                  by {creatorName}
                </h3>
              </CreatorPreviewTrigger>
            </div>
            <div className="text-nowrap">
              <OverlayTrigger overlay={<Tooltip>Settings</Tooltip>}>
                <NavLink
                  to="/settings#algoSettings"
                  className="d-none d-sm-inline btn btn-outline"
                >
                  <span className="visually-hidden">Algorithm Settings</span>
                  <Gear />
                </NavLink>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>More options...</Tooltip>}>
                <Dropdown className="d-inline">
                  <Dropdown.Toggle as={MoreActionsBtn} />
                  <Dropdown.Menu>
                    <Dropdown.Item
                      to={`/settings#algoSettings`}
                      className="d-flex d-sm-none align-items-center gap-2"
                      as={NavLink}
                    >
                      <Gear />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        shareContent({
                          title: cityName,
                          url:
                            `${window.location.origin}/city/${data.id}?groupStatus=off`,
                        })}
                      className="d-flex align-items-center gap-2"
                    >
                      <Share />
                      Share
                    </Dropdown.Item>
                    <Dropdown.Item
                      href={`/?creator=${data.creatorId}`}
                      className="d-flex align-items-center gap-2"
                      target="_blank"
                    >
                      <Building />
                      View creator cities
                      <ArrowUpRight />
                    </Dropdown.Item>
                    <Dropdown.Item
                      href={`/creators/?creator=${data.creatorId}`}
                      className="d-flex align-items-center gap-2"
                      target="_blank"
                    >
                      <Person />
                      View creator info
                      <ArrowUpRight />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </OverlayTrigger>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((a) => a + 1)}
          >
            <span className="visually-hidden">To next city</span>
            <OverlayTrigger overlay={<Tooltip>To next city</Tooltip>}>
              <ChevronRight width="20" height="20" />
            </OverlayTrigger>
          </Button>
        </AdaptiveHeader>
      </AdaptiveHeaderProvider>
      <div className="main-wrapper m-auto">
        <section id="gallery" className="mt-3 position-relative">
          <Suspense
            key={page}
            fallback={
              <img
                src={PlaceholderImg}
                alt=""
                className="w-100"
                style={{ aspectRatio: "16/9" }}
              />
            }
          >
            <CityGallery page={1} city={data} />
          </Suspense>
        </section>
        <section
          id="details"
          className={`mt-3 position-relative`}
        >
          <Details
            key={data.id}
            cityDetails={data}
            error={error}
            isFetching={isFetching}
          />
        </section>
      </div>
    </div>
  );
};

export default RandomCity;
