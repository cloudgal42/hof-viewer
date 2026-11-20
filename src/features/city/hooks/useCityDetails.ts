import { useQuery } from "@tanstack/react-query";
import type { City, GroupedCities } from "../../../types/City";
import { useGroupedCities } from "../../../hooks/useGroupedCities";
import { useLocation } from "react-router";
import { useCreatorCities } from "./useCreatorCities";

export const useCityDetails = (
	{isCitiesGrouped, cityCreator, cityParam} : {
		isCitiesGrouped: boolean,
		cityCreator: string,
		cityParam: string | undefined,
	}
) => {
	const location = useLocation();
	const placeholderCity = location.state?.placeholderData as City | GroupedCities | undefined;

	const {
    data: creatorCities,
    error: creatorCitiesError,
    isFetching: isCreatorCitiesFetching
  } = useCreatorCities(cityCreator);

	const {groupCities} = useGroupedCities(cityCreator);

	const {error, data, isFetching} = useQuery<City>({
    queryKey: ["city", {id: cityParam}],
    queryFn: async () => {
      // const link = isInPrerenderEnv ?
      //   `${import.meta.env.VITE_HOF_SERVER}/screenshots/${cityParam}`
      //   : `${import.meta.env.VITE_HOF_SERVER}/screenshots/${cityParam}?favorites=true&views=true`
			if (!cityParam) return;

      const res = await fetch(`${import.meta.env.VITE_HOF_SERVER}/screenshots/${cityParam}?favorites=true&views=true`);
      const data = await res.json();

      if (!res.ok) {
        return Promise.reject(new Error(`${data.statusCode}: ${data.message}`));
      }

      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: Boolean(!placeholderCity?.favorites && !placeholderCity?.views && !isCitiesGrouped ||
      placeholderCity?.showcasedModId && !isCitiesGrouped || !isCitiesGrouped)
,
		retry: false,
  });

	const fetchError = error || creatorCitiesError;

  const cityDetails = isCitiesGrouped
    ? creatorCities && groupCities(creatorCities).find(entry => entry.cityName.toLowerCase() === cityParam?.toLowerCase())
    : data || placeholderCity;

	return {
		fetchError,
		cityDetails,
		isFetching: isCreatorCitiesFetching || isFetching
	}
}
