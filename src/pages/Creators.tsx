import {Button, Form} from "react-bootstrap";
import {CreatorCard} from "../components/creators/CreatorCard/CreatorCard.tsx";
import {PlaceholderCreatorCard} from "../components/creators/CreatorCard/PlaceholderCreatorCard.tsx";
import {NavLink, useSearchParams} from "react-router";
import {handleSetSearchParams} from "../utils/SearchParamHandlers.ts";
import type {CreatorDetails} from "../interfaces/Creator.ts";
import {useQuery} from "@tanstack/react-query";
import {ErrorScreen} from "../components/misc/ErrorScreen/ErrorScreen.tsx";
import {useCreator} from "../hooks/useCreator.ts";
import {Helmet} from "@dr.pogodin/react-helmet";
import {DefaultHelmet} from "../components/misc/DefaultHelmet/DefaultHelmet.tsx";
import Chirper from "../assets/Chirper.svg";

const Creators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [fetchStatus, setFetchStatus] = useState<number>();

  // const [creatorDetails, setCreatorDetails] = useState<CreatorDetails | null>();
  // const [isCreatorLoading, setIsCreatorLoading] = useState<boolean>(false);
  const creator = searchParams.get("creator") || "";

  const {error, data, isFetching} = useCreator(creator);

  const creatorDetails = data;

  // useEffect(() => {
  //   let ignore = false;
  //   if (!creator) return;
  //
  //   async function getCreatorDetails() {
  //     setIsCreatorLoading(true);
  //     const creatorRes = await fetch(`${import.meta.env.VITE_HOF_SERVER}/creators/${creator}`);
  //     const creatorStatsRes = await fetch(`${import.meta.env.VITE_HOF_SERVER}/creators/${creator}/stats`);
  //
  //     const creatorInfo = await creatorRes.json();
  //     const creatorStats = await creatorStatsRes.json();
  //
  //     setFetchStatus(creatorStatsRes.status);
  //
  //     if (creatorRes.ok && creatorStatsRes.ok && !ignore) {
  //       setCreatorDetails({
  //         ...creatorInfo,
  //         ...creatorStats,
  //       });
  //       setIsCreatorLoading(false);
  //     } else {
  //       setIsCreatorLoading(false);
  //       setCreatorDetails(null);
  //     }
  //   }
  //
  //   getCreatorDetails();
  //
  //   return () => {
  //     ignore = true
  //   };
  // }, [creator]);

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

  if (isFetching) {
    content = <PlaceholderCreatorCard/>;
  } else if (creatorDetails) {
    content = <CreatorCard creator={creatorDetails}/>;
  } else if (error) {
    content = (
      <ErrorScreen
        errorSummary="Failed to get screenshots for this creator :("
        errorDetails={error.message}
      />
    )
  } else if (!navigator.onLine) {
    content = (
      <ErrorScreen
        errorSummary="You are offline :("
        errorDetails="Double check your Internet connection and try again."
      />
    )
  } else {
    content = (
      <div className="d-flex text-muted flex-column align-items-center text-center">
        <img src={Chirper} width="162" height="162" alt="Chirper" />
        <p className="mb-1">Search by the creator name/ID to get started.</p>
        <p className="mb-1">
          Don't know who to search for? Browse screenshots from great HoF creators <NavLink to={`/random`}>
          here</NavLink>
        </p>
      </div>
    );
  }

  return (
    <div className="main-wrapper flex-grow-1 ms-sm-5 me-sm-5">
      <DefaultHelmet />
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
        </div>
        <div id="creator">
          {content}
        </div>
      </section>
    </div>
  )
}
export default Creators