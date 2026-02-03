import {useState} from "react";
import {Accordion, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {ModCard} from "./ModCard.tsx";

import "../../../css/components/ModList.scss"
import InfiniteScroll from "react-infinite-scroll-component";
import {PlaceholderModCard} from "./PlaceholderModCard.tsx";
import {useDebounceCallback} from "usehooks-ts";
import * as React from "react";
import Fuse from "fuse.js";
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import type {Mod} from "../../../interfaces/Mod.ts";
import {ErrorScreen} from "../../ErrorScreen/ErrorScreen.tsx";
import {useQuery} from "@tanstack/react-query";

interface ModCategories {
  mod: boolean;
  map: boolean;
  prefab: boolean;
}

interface ModListProps {
  city: City | GroupedCities;
}

const DEFAULT_MODS_PER_PAGE = 12;

export const ModList = ({city}: ModListProps) => {
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  // const [modList, setModList] = useState<Mod[]>([]);

  const [categories, setCategories] = useState<ModCategories>({
    mod: false,
    map: false,
    prefab: false,
  });
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);

  const {isFetching, data, error, refetch} = useQuery<Mod[]>({
    queryKey: ["playset", {city: city.id}],
    queryFn: async () => {
      if (city.paradoxModIds.length === 0 || !city.shareParadoxModIds) {
        return [];
      }
      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/${city.id}/playset`)
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: false,
  })

  const debouncedSetSearch = useDebounceCallback((e) => {
    setSearch(e.target.value);
    setIsDebouncing(false);
  }, 600);

  function handleSetCategory(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, checked} = e.currentTarget;

    setCategories(a => {
      return {...a, [name]: checked};
    })
  }

  function filterModList(list: Mod[]) {
    const categoryList = Object.entries(categories)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => {
        if (key === "mod") return "code mod"
        return key;
      });
    if (categoryList.length === 0) return list;

    return list.filter(mod => {
      // Filters out any assets that are labelled as "Code Mods"
      // due to using old way of importing assets/EAI
      // Some assets will still be included due to lack of a "Prefab" tag
      if (categoryList.includes("code mod")
        && !categoryList.includes("prefab")
        && mod.tags.includes("prefab")) return false
      return mod.tags.some(tag => categoryList.includes(tag.toLowerCase()));
    });
  }

  const filteredModList = filterModList(data || []);
  const fuse = new Fuse(filteredModList, {
    threshold: 0.2,
    includeScore: false,
    keys: ["name", "authorName", "tags"]
  })

  const searchedModList = search ?
    fuse.search(search) :
    filteredModList.map(mod => {
      return {item: {...mod}}
    });

  const paginatedModList = searchedModList.toSpliced(page * DEFAULT_MODS_PER_PAGE);
  const isPlaysetFiltered = Object.values(categories).some(value => value === true);

  let content;
  let accordionBody;

  if (!navigator.onLine) {
    accordionBody = (
      <ErrorScreen
        errorSummary="You are offline :("
        errorDetails="Double check your Internet connection and try again."
      />
    )
  } else if (isFetching || isDebouncing || !data) {
    accordionBody = (
      <div className="playset-container d-flex flex-wrap gap-2">
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
        <PlaceholderModCard/>
      </div>
    )
  } else if (error) {
    accordionBody = (
      <ErrorScreen
        errorSummary={"Failed to get playset data :("}
        errorDetails={error.message}
      />
    )
  } else if (searchedModList.length === 0 && (search.length > 0 || isPlaysetFiltered)) {
    accordionBody = (
      <ErrorScreen
        errorSummary={"No packages found :("}
        errorDetails={"Double check your query or filters and try again."}
      />
    )
  } else {
    accordionBody = (
      <InfiniteScroll
        next={() => setPage(a => a + 1)}
        hasMore={searchedModList.length > paginatedModList.length}
        className="playset-container d-flex flex-wrap gap-2"
        dataLength={paginatedModList.length}
        loader={
          <>
            Loading
          </>
        }
      >
        {paginatedModList.map(entry =>
          <ModCard
            key={entry.item.id}
            isCompactMode={isCompactMode}
            mod={entry.item}
          />
        )}
      </InfiniteScroll>
    )
  }

  if (new Date(city.createdAt).getTime() < new Date("2025-03-24T00:00:00.000Z").getTime()
      && city.paradoxModIds.length === 0) {
    content = <p>This screenshot was posted before playset sharing was possible.</p>
  } else if (city.paradoxModIds.length === 0 && city.shareParadoxModIds) {
    content = <p>The creator did not use mods for this screenshot.</p>
  } else if (!city.shareParadoxModIds) {
    content = <p>This creator chose not to share their playset for this screenshot.</p>
  } else {
    content = (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header
            onClick={() => !data && refetch()}
          >
            {city.paradoxModIds.length} PDX mods packages
          </Accordion.Header>
          <Accordion.Body>
            <InputGroup className="mb-3">
              <div className="w-100 mb-2">
                <Form.Control
                  type="text"
                  name="modSearch"
                  aria-label="Search by name, tags or author"
                  placeholder="Search by name, tags or author..."
                  onChange={(e) => {
                    setIsDebouncing(true);
                    debouncedSetSearch(e);
                  }}
                />
              </div>
              <div className="d-flex flex-column flex-md-row">
                <OverlayTrigger overlay={
                  <Tooltip>Hides mod thumbnail for a more compact view.</Tooltip>
                }>
                  <div className="pe-md-2">
                    <Form.Check
                      type="checkbox"
                      name="compactMode"
                      id="compactMode"
                      label="Hide Thumbnails"
                      onChange={(e) => setIsCompactMode(e.currentTarget.checked)}
                    />
                  </div>
                </OverlayTrigger>
                <div className="d-none d-md-block" style={{borderRight: "1px solid gray"}}></div>
                <div className="ps-md-2 d-flex flex-column flex-md-row gap-1 gap-md-3">
                  <p className="mb-0">Category: </p>
                  <Form.Check
                    type="checkbox"
                    name="mod"
                    id="mod"
                    label="Mods"
                    checked={categories.mod}
                    onChange={handleSetCategory}
                  />
                  <Form.Check
                    type="checkbox"
                    name="map"
                    id="map"
                    label="Maps"
                    checked={categories.map}
                    onChange={handleSetCategory}
                  />
                  <Form.Check
                    type="checkbox"
                    name="prefab"
                    id="prefab"
                    label="Assets"
                    checked={categories.prefab}
                    onChange={handleSetCategory}
                  />
                </div>
              </div>
            </InputGroup>
            {accordionBody}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
  }
  return (
    <>{content}</>
  )
}