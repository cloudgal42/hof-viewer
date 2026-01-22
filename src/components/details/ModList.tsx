import {useMemo, useState} from "react";
import {Accordion, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import type {City, GroupedCities, Mod} from "../home/CityCard.tsx";
import SadChirper from "../../assets/sadChirpyOutline.svg";
import {ModCard} from "./ModCard.tsx";

import "../../css/components/ModList.scss"
import InfiniteScroll from "react-infinite-scroll-component";
import {PlaceholderModCard} from "./PlaceholderModCard.tsx";
import {useDebounceCallback} from "usehooks-ts";
import * as React from "react";

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
  const [fetchStatus, setFetchStatus] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modList, setModList] = useState<Mod[]>([]);

  const [categories, setCategories] = useState<ModCategories>({
    mod: false,
    map: false,
    prefab: false,
  });
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);

  const debouncedSetSearch = useDebounceCallback((e) => {
    setSearch(e.target.value);
    setIsLoading(false);
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

  async function getPlayset() {
    if (modList.length > 0 || city.paradoxModIds.length === 0 || !city.shareParadoxModIds) {
      return;
    }

    setIsLoading(true);
    const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots/${city.id}/playset`)
    const data = await res.json();

    setFetchStatus(res.status);

    if (res.ok) {
      setModList(data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  const filteredModList = filterModList(modList);

  const searchedModList = useMemo(() => {
    if (!search) return filteredModList;
    const query = search.toLowerCase();
    return filteredModList.filter(mod => {
      // TODO: Implement searching by character (i.e. user can search "a"
      // and returns any mod name or author with the character "a")
      const tags = mod.tags.map(tag => tag.toLowerCase());
      const matchesName = mod.name
        .toLowerCase()
        .split(" ")
        .includes(query);
      const matchesAuthor = mod.authorName
        .toLowerCase()
        .split(" ")
        .includes(query);
      const matchesTags = tags.includes(query);

      return matchesName || matchesAuthor || matchesTags;
    });

  }, [filteredModList, search]);

  const paginatedModList = searchedModList.toSpliced(page * DEFAULT_MODS_PER_PAGE);

  let content;
  let accordionBody;

  if (isLoading) {
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
  } else if (fetchStatus !== 200 && fetchStatus) {
    accordionBody = (
      <div className="text-center m-auto my-3">
        <img
          width="128"
          height="128"
          src={SadChirper}
          alt=""
        />
        <p className="mb-1 text-muted">Failed to get playset data :(</p>
        <p className="mb-1 text-muted">
          {fetchStatus === 404 ? "The playset data does not exist" : `HTTP Status: ${fetchStatus}. Please wait for a moment and try again.`}
        </p>
      </div>
    )
  } else if (searchedModList.length === 0 && search.length > 0) {
    accordionBody = (
      <div className="text-center m-auto my-5">
        <img
          width="128"
          height="128"
          src={SadChirper}
          alt=""
        />
        <p className="mb-1 text-muted">No mods found :(</p>
        <p className="mb-1 text-muted">Double check your query and try again.</p>
      </div>
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
        {paginatedModList.map(mod =>
          <ModCard
            key={mod.id}
            isCompactMode={isCompactMode}
            mod={mod}
          />
        )}
      </InfiniteScroll>
    )
  }

  if (new Date(city.createdAt).getTime() < new Date("2025-03-24T00:00:00.000Z").getTime()) {
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
            onClick={getPlayset}
          >
            {city.paradoxModIds.length} mods used
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
                    setIsLoading(true);
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