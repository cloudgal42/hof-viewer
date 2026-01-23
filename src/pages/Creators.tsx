import {Button, Form} from "react-bootstrap";
import {CreatorCard, type CreatorDetails} from "../components/creators/CreatorCard.tsx";
import {useEffect, useState} from "react";
import {PlaceholderCreatorCard} from "../components/creators/PlaceholderCreatorCard.tsx";
import {useSearchParams} from "react-router";
import {handleSetSearchParams} from "../utils/SearchParamHandlers.ts";
import SadChirper from "../assets/sadChirpyOutline.svg";

const Creators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fetchStatus, setFetchStatus] = useState<number>();

  const [creatorDetails, setCreatorDetails] = useState<CreatorDetails | null>();
  const [isCreatorLoading, setIsCreatorLoading] = useState<boolean>(false);
  const creator = searchParams.get("creator") || "";

  useEffect(() => {
    let ignore = false;
    if (!creator) return;

    async function getCreatorDetails() {
      setIsCreatorLoading(true);
      const creatorRes = await fetch(`https://halloffame.cs2.mtq.io/api/v1/creators/${creator}`);
      const creatorStatsRes = await fetch(`https://halloffame.cs2.mtq.io/api/v1/creators/${creator}/stats`);

      const creatorInfo = await creatorRes.json();
      const creatorStats = await creatorStatsRes.json();

      setFetchStatus(creatorStatsRes.status);

      if (creatorRes.ok && creatorStatsRes.ok && !ignore) {
        setCreatorDetails({
          ...creatorInfo,
          ...creatorStats,
        });
        setIsCreatorLoading(false);
      } else {
        setIsCreatorLoading(false);
        setCreatorDetails(null);
      }
    }

    getCreatorDetails();

    return () => {
      ignore = true
    };
  }, [creator]);

  // function validateAndSetCreator(creator: string) {
  //   setSearchParams(handleSetSearchParams(searchParams, "creator", creator));
  // }

  function setCreator(formData: FormData) {
    const query = formData.get("creatorId");
    const queryString = query?.toString() || "";
    if (queryString === creator) return;
    setSearchParams(handleSetSearchParams(searchParams, "creator", queryString));
  }

  let content;

  if (isCreatorLoading) {
    content = <PlaceholderCreatorCard/>;
  } else if (creatorDetails) {
    content = <CreatorCard creator={creatorDetails}/>;
  } else if (fetchStatus && fetchStatus !== 200) {
    content = (
      <div className="w-100 d-flex flex-column align-items-center text-center">
        <img src={SadChirper} width="148" height="148" alt="" />
        <p className="text-muted mb-1">
          {fetchStatus === 404 ? "No creators found :(" : "Something went wrong :("}
        </p>
        <p className="text-muted mb-1">
          {fetchStatus === 404 ?
            "The creator likely have not registered an HoF account."
            : `HTTP status code: ${fetchStatus}. Please wait for a while and try again.`
          }
        </p>
      </div>
    )
  } else {
    content = <p>Search by the creator name/ID to get started.</p>
  }

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <h2>Creator Search</h2>
      <section className="mt-3 mb-3">
        <Form.Label htmlFor="creatorId">Enter the Creator ID:</Form.Label>
        <form action={setCreator}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              name="creatorId"
              id="creatorId"
              aria-describedby="creatorIdHelpBlock"
              placeholder="Creator ID..."
              defaultValue={creator}
              // onChange={e => validateAndSetCreator(e.currentTarget.value)}
            />
            <Button type="submit" variant="primary">Search</Button>
          </div>
          <Form.Text id="creatorIdHelpBlock">Can either be the username or the public Creator ID.</Form.Text>
        </form>
      </section>
      <section>
        <div className="d-flex mb-3 align-items-sm-center justify-content-between flex-column flex-sm-row">
          <h2 className="mb-0">Creator</h2>
          {/*<div className="d-flex justify-content-between align-items-center gap-2">*/}
          {/*  <div className="d-flex gap-2 align-items-center text-nowrap">*/}
          {/*    <Form.Check*/}
          {/*      name="groupCities"*/}
          {/*      id="groupCitiesCheck"*/}
          {/*      onClick={(e) => setIsGrouped(e.currentTarget.checked)}/>*/}
          {/*    <Form.Label*/}
          {/*      htmlFor="groupCitiesCheck"*/}
          {/*      className="mb-0"*/}
          {/*    >*/}
          {/*      Group Cities*/}
          {/*    </Form.Label>*/}
          {/*  </div>*/}
          {/*  <div className="d-flex gap-2 align-items-center">*/}
          {/*    <SortOrderButton sortOrder={sortOrder} setSortOrder={setSortOrder}/>*/}
          {/*    <SortDropdown setSortBy={setSortBy}/>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <div id="creator" className="d-flex flex-wrap gap-3">
          {content}
        </div>
      </section>
    </div>
  )
}
export default Creators