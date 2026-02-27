import {AdaptiveHeader} from "../components/details/AdaptiveHeader/AdaptiveHeader.tsx";
import {AdaptiveHeaderProvider} from "../providers/AdaptiveHeaderProvider.tsx";
import {Suspense, useContext, useState} from "react";
import {AdaptiveHeaderContext} from "../context/AdaptiveHeaderContext.ts";
import {Button, Dropdown, OverlayTrigger, Tooltip} from "react-bootstrap";
import {MoreActionsBtn} from "../components/misc/MoreActionsBtn/MoreActionsBtn.tsx";
import {Building, ChevronLeft, ChevronRight, Gear, Person, Share} from "react-bootstrap-icons";
import type {City} from "../interfaces/City.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ErrorScreen} from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import {PlaceholderDetails} from "../components/details/Details/PlaceholderDetails.tsx";
import PlaceholderImg from "../assets/placeholder.svg";
import {Details} from "../components/details/Details/Details.tsx";
import CityGallery from "../components/details/CityGallery/CityGallery.tsx";
import {CreatorPreviewTrigger} from "../components/misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import {
  PlaceholderHeaderWithControls
} from "../components/randomcity/PlaceholderHeaderWithControls/PlaceholderHeaderWithControls.tsx";
import {shareContent} from "../utils/ShareContent.ts";
import {
  AlgoSettingsModal,
} from "../components/randomcity/AlgoSettings/AlgoSettingsModal.tsx";
import {useLocalStorage} from "usehooks-ts";
import type {RandomAlgoSettings} from "../interfaces/RandomAlgoSettings.ts";

// TODO: Add labels to all buttons that only use tooltips as labels

const RandomCity = () => {
  const headerCollapsed = useContext(AdaptiveHeaderContext);
  const [page, setPage] = useState<number>(0);
  const [isSettingsShown, setIsSettingsShown] = useState<boolean>(false);
  const [randomAlgoSettings, setRandomAlgoSettings]
    = useLocalStorage<RandomAlgoSettings>("randomAlgoSettings", {
    random: 0,
    popular: 0,
    trending: 0,
    recent: 0,
    archeologist: 0,
    supporter: 0,
    viewMaxAge: 0,
  });

  const queryClient = useQueryClient();

  const {data, isFetching, error} = useQuery<City>({
    queryKey: ["city", page],
    queryFn: fetchRandomCity,
    staleTime: 1000 * 60 * 30,
    retry: false,
    enabled: true,
  });

  // Optimistically fetch the next random city data as well as images for a snappier UX
  queryClient.fetchQuery<City>({
    queryKey: ["city", page + 1],
    queryFn: fetchRandomCity,
    staleTime: 1000 * 60 * 30,
    retry: false,
  }).then((data) => {
    const img = new Image();
    img.src = data.imageUrlFHD;
  });

  async function fetchRandomCity() {
    const options: string[][] = Object.entries(randomAlgoSettings)
      .map(([key, value]) => [key, value.toString()]);
    const query = new URLSearchParams(options).toString();
    const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/weighted?${query}`);
    const data = await res.json();

    if (!res.ok) {
      return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
    }

    return data;
  }

  function openSettings() {
    setIsSettingsShown(true);
  }

  if (!navigator.onLine) {
    return (
      <ErrorScreen
        errorSummary="Failed to get random screenshots :("
        errorDetails="Double check your internet connection and try again."/>
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
        <PlaceholderHeaderWithControls/>
        <PlaceholderDetails/>
      </div>
    )
  }

  return (
    <div className="flex-grow-1">
      <AlgoSettingsModal
        show={isSettingsShown}
        setShow={setIsSettingsShown}
        randomAlgoSettings={randomAlgoSettings}
        setRandomAlgoSettings={setRandomAlgoSettings}
      />
      <AdaptiveHeaderProvider>
        <AdaptiveHeader className="w-100 d-flex flex-row align-items-center justify-content-between">
          <Button
            variant="outline"
            onClick={() => setPage(a => a - 1)}
            disabled={page === 0}
          >
            <OverlayTrigger overlay={<Tooltip>To previous city</Tooltip>}>
              <ChevronLeft width="20" height="20"/>
            </OverlayTrigger>
          </Button>
          <div className="d-flex gap-2 gap-sm-3 flex-row align-items-center justify-content-between">
            <div className="h2-container mb-0 d-flex flex-column flex-sm-row align-items-center gap-sm-2">
              <h2 className="mb-0 text-center text-sm-start">{data.cityName}</h2>
              <CreatorPreviewTrigger
                creator={data.creator.creatorName}
                showLinks={true}
              >
                <h3 className="text-muted text-center text-sm-start d-inline">by {data.creator.creatorName}</h3>
              </CreatorPreviewTrigger>
            </div>
            <div>
              <OverlayTrigger overlay={<Tooltip>Settings</Tooltip>}>
                <Button
                  className="d-none d-sm-inline"
                  variant="outline"
                  onClick={openSettings}
                >
                  <Gear/>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>More options...</Tooltip>}>
                <Dropdown className="d-inline">
                  <Dropdown.Toggle as={MoreActionsBtn}/>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className="d-flex d-sm-none align-items-center gap-2"
                      onClick={openSettings}
                    >
                      <Gear/>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => shareContent({
                        title: data.cityName,
                        url: `${window.location.origin}/city/${data.id}`
                      })}
                      className="d-flex align-items-center gap-2"
                    >
                      <Share/>
                      Share
                    </Dropdown.Item>
                    <Dropdown.Item
                      href={`/?creator=${data.creatorId}`}
                      className="d-flex align-items-center gap-2"
                      target="_blank"
                    >
                      <Building/>
                      View creator cities
                    </Dropdown.Item>
                    <Dropdown.Item
                      href={`/creators/?creator=${data.creatorId}`}
                      className="d-flex align-items-center gap-2"
                      target="_blank"
                    >
                      <Person/>
                      View creator info
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </OverlayTrigger>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(a => a + 1)}
          >
            <OverlayTrigger overlay={<Tooltip>To next city</Tooltip>}>
              <ChevronRight width="20" height="20"/>
            </OverlayTrigger>
          </Button>
        </AdaptiveHeader>
      </AdaptiveHeaderProvider>
      <div className="main-wrapper m-auto">
        <section id="gallery" className="mt-3 position-relative">
          <Suspense key={page} fallback={
            <img
              src={PlaceholderImg}
              alt=""
              className="w-100"
              style={{aspectRatio: "16/9"}}
            />}
          >
            <CityGallery page={1} city={data}/>
          </Suspense>
        </section>
        <section
          id="details"
          className={`mt-3 position-relative`}
        >
          <Details cityDetails={data} error={error} isFetching={isFetching}/>
        </section>
      </div>
    </div>
  );
}

export default RandomCity;