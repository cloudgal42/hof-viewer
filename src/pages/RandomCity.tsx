import {AdaptiveHeader} from "../components/details/AdaptiveHeader/AdaptiveHeader.tsx";
import {AdaptiveHeaderProvider} from "../components/providers/AdaptiveHeaderProvider.tsx";
import {Suspense, useContext, useState} from "react";
import {AdaptiveHeaderContext} from "../context/AdaptiveHeaderContext.ts";
import {Button, Dropdown, OverlayTrigger, Tooltip} from "react-bootstrap";
import {MoreActionsBtn} from "../components/misc/MoreActionsBtn/MoreActionsBtn.tsx";
import {Building, ChevronDown, ChevronLeft, ChevronRight, Person, Share} from "react-bootstrap-icons";
import type {City} from "../interfaces/City.ts";
import {useQuery} from "@tanstack/react-query";
import {ErrorScreen} from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import {PlaceholderDetails} from "../components/details/Details/PlaceholderDetails.tsx";
import PlaceholderImg from "../assets/placeholder.svg";
import {Details} from "../components/details/Details/Details.tsx";
import CityGallery from "../components/details/CityGallery/CityGallery.tsx";
import {NavLink} from "react-router";
import {CreatorPreviewTrigger} from "../components/misc/CreatorPreview/CreatorPreviewTrigger.tsx";
import {PlaceholderDetailsHeader} from "../components/details/Details/PlaceholderDetailsHeader.tsx";

const RandomCity = () => {
  const headerCollapsed = useContext(AdaptiveHeaderContext);
  const [page, setPage] = useState<number>(0);

  const {data, isFetching, error} = useQuery<City>({
    queryKey: ["city", page],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/weighted`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    enabled: true,
    staleTime: 30 * 60 * 1000,
    retry: false,
  })

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
        <PlaceholderDetailsHeader/>
        <PlaceholderDetails/>
      </div>
    )
  }

  return (
    <div className="flex-grow-1">
      <AdaptiveHeaderProvider>
        <AdaptiveHeader className="w-100 d-flex flex-row align-items-center justify-content-between">
          <Button
            variant="outline"
            onClick={() => setPage(a => a - 1)}
            disabled={page === 0}
          >
            <OverlayTrigger overlay={<Tooltip>To previous city</Tooltip>}>
              <ChevronLeft width="20" height="20" />
            </OverlayTrigger>
          </Button>
          <div className="d-flex gap-3 flex-row align-items-center justify-content-between">
            <div className="h2-container mb-0 d-flex align-items-center gap-2">
              <h2 className="mb-0">{data.cityName}</h2>
              <CreatorPreviewTrigger
                creator={data.creator.creatorName}
                showLinks={true}
              >
                <h3 className="text-muted d-inline">by {data.creator.creatorName}</h3>
              </CreatorPreviewTrigger>
            </div>
            <Dropdown>
              <Dropdown.Toggle as={MoreActionsBtn}/>
              <Dropdown.Menu>
                <Dropdown.Item className="d-flex align-items-center gap-2">
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
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(a => a + 1)}
          >
            <OverlayTrigger overlay={<Tooltip>To next city</Tooltip>}>
              <ChevronRight width="20" height="20" />
            </OverlayTrigger>
          </Button>
        </AdaptiveHeader>
      </AdaptiveHeaderProvider>
      <div className="main-wrapper m-auto">
        <section id="gallery" className="mt-3 position-relative">
          <Suspense fallback={<img
            src={PlaceholderImg}
            alt=""
            className="w-100"
            style={{aspectRatio: "16/9"}}/>}
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