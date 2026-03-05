import {useEventListener, useTimeout} from "usehooks-ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {useLocation} from "react-router";
import type {QueryClient} from "@tanstack/react-query";

// 30 min
const DEFAULT_GC_TIME = 1000 * 60 * 30;

export const useRandomCityGc =
  (queryClient: QueryClient, callback?: () => void) => {
    const [isGcArmed, setIsGcArmed] = useState<boolean>(false);
    const [isAppFocused, setIsAppFocused]
      = useState<boolean>(document.visibilityState === "visible");

    const documentRef = useRef<Document>(document);
    const gcPendingRef = useRef<boolean>(false);
    const location = useLocation();
    // Since the app rerenders when the user navigates, isOnRandomCity can
    // just be a derived value instead of a State
    const isOnRandomCity = location.pathname === "/random";

    useEventListener("visibilitychange", () => {
      setIsAppFocused(document.visibilityState === "visible");
    }, documentRef);

    // Start the random city GC countdown. If it already started, the timer is restarted.
    function startGc() {
      console.debug("GC for randomCity query cache started.");
      gcPendingRef.current = false;
      setIsGcArmed(false);
      setTimeout(() => setIsGcArmed(true), 1);
    }

    const clearRandomCitiesCache = useCallback(() => {
      console.time("Clearing randomCity query cache took");
      queryClient.removeQueries({queryKey: ["randomCity"]});
      if (callback) {
        callback();
      }
      console.timeEnd("Clearing randomCity query cache took");
    }, [callback, queryClient]);

    useTimeout(() => {
      if (isOnRandomCity && isAppFocused) {
        console.debug("Detected user focused on random city page, deferring GC...");
        gcPendingRef.current = true;
      } else {
        clearRandomCitiesCache();
      }
    }, isGcArmed ? DEFAULT_GC_TIME : null);

    useEffect(() => {
      if ((!isOnRandomCity || !isAppFocused)
        && gcPendingRef.current) {
        clearRandomCitiesCache();
      }
    }, [isOnRandomCity, clearRandomCitiesCache, isAppFocused]);

    return {startGc};
  }