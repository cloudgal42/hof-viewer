import {useEffect, useRef, useState} from "react";
import type {TrendsData, WorkerParams} from "../interfaces/TrendsData.ts";
import type { City, GroupedCities } from "../interfaces/City.ts";

export const useCityTrendsWorker = (
  {
    city,
    groupPeriod,
    trendType,
  }: {
    city: City | GroupedCities;
    groupPeriod: number;
    trendType: string;
  },
) => {
  const [groupedCounts, setGroupedCounts] = useState<TrendsData>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const viewsWorkerRef = useRef<Worker>(null);

  useEffect(() => {
    viewsWorkerRef.current = new Worker(
      new URL("../workers/TrendsWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    const params: WorkerParams = {
      city,
      day: groupPeriod,
      type: trendType,
    };

    viewsWorkerRef.current.postMessage(params);
    // Only show loading state if its taking longer than 67ms
    const timerId = setTimeout(() => setIsProcessing(true), 67);

    viewsWorkerRef.current.onmessage = (e) => {
      setGroupedCounts(e.data);
      clearTimeout(timerId);
      setIsProcessing(false);
    };

    return () => {
      clearTimeout(timerId);
      if (viewsWorkerRef.current) viewsWorkerRef.current.terminate();
    };
  }, [city, groupPeriod, trendType]);

  return {data: groupedCounts, isProcessing};
};
