import {useEffect, useRef, useState} from "react";
import type {TrendsData, TrendsWorkerInput, WorkerMsg, WorkerParams} from "../interfaces/TrendsData.ts";

export const useTrendsWorker = (
  {
    data,
    groupPeriod,
    trendType,
    enabled
  }: {
    data: TrendsWorkerInput | null;
    groupPeriod: number;
    trendType: string;
    enabled: boolean;
  },
) => {
  const [groupedCounts, setGroupedCounts] = useState<TrendsData | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const viewsWorkerRef = useRef<Worker>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!data) return;

    viewsWorkerRef.current = new Worker(
      new URL("../workers/TrendsWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    const params: WorkerParams = {
      inputData: data,
      day: groupPeriod,
      type: trendType,
    };

    viewsWorkerRef.current.postMessage(params);
    // Only show loading state if its taking longer than 67ms
    const timerId = setTimeout(() => {
      setIsProcessing(true);
      setProgress(0);
    }, 67);

    viewsWorkerRef.current.onmessage = (e: MessageEvent<WorkerMsg>) => {
      if (e.data.type === "calculationCompleted") {
        setGroupedCounts(e.data.payload);
        clearTimeout(timerId);
        setIsProcessing(false);
      } else if (e.data.type === "progress") {
        setProgress(e.data.payload.progressPercentage);
      }
    };

    return () => {
      clearTimeout(timerId);
      if (viewsWorkerRef.current) viewsWorkerRef.current.terminate();
    };
  }, [data, groupPeriod, trendType, enabled]);

  return {data: groupedCounts, isProcessing, progress};
};
