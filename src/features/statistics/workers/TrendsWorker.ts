import type {
  Views,
} from "../../../interfaces/City.ts";
import type {
  TrendsData,
  TrendsWorkerInput, WorkerMsg,
  WorkerParams,
} from "../types/TrendsData.ts";

const DAYS_IN_MILLISECONDS = 86400000;

function send(params: WorkerMsg) {
  self.postMessage(params);
}

self.onmessage = ({ data }: { data: WorkerParams }) => {
  const { inputData, day, type } = data;
  const result = groupData(inputData, day, type);
  send({
    type: "calculationCompleted",
    payload: result
  });
};

function filterUniqueViews(views: Views[]) {
  const uniqueCreatorIds: (string)[] = [];
  return views.filter((entry) => {
    const isUnique = !(uniqueCreatorIds.includes(entry.creatorId));
    uniqueCreatorIds.push(entry.creatorId);
    return isUnique;
  });
}

function groupDates(start: Date, end: Date, period: number) {
  const startEpoch = start.getTime();
  const endEpoch = end.getTime();

  let currEpoch = startEpoch;
  const groupedDates = [];

  while (currEpoch < endEpoch) {
    const startRange = new Date(currEpoch);
    currEpoch += period * DAYS_IN_MILLISECONDS;
    const endRange = (currEpoch > endEpoch)
      ? new Date(endEpoch)
      : new Date(currEpoch);

    groupedDates.push([startRange, endRange]);
  }

  return groupedDates;
}

function groupData(
  data: TrendsWorkerInput,
  day: number,
  type: string,
): TrendsData | [] {
  // 1. Get the current date and the date posted in ms since the UNIX epoch
  const currDate = new Date();
  const datePosted = new Date(data.createdAt);
  // FIXME: Implement better undefined check
  if (!data.views && !data.favorites) return [];

  // 1.5. If type is "uniqueViews", filter views to only unique view entries
  const uniqueViews = filterUniqueViews(data.views!);

  // 2. Get grouped dates. groupedDates contain arrays of Date object with a length of 2
  // Index 0 is start, Index 1 is end
  const groupedDates = groupDates(datePosted, currDate, day);

  let processedCounts = 0;
  
  const totalToProcess = type === "favorites"
    ? data.favorites?.length ?? 0
    : type === "uniqueViews"
    ? uniqueViews.length ?? 0
    : data.views?.length ?? 0;
  
  const progressInterval = Math.ceil(0.05 * groupedDates.length);

  // 3. Loop through groupedDates. Within this array, loop through the views/favorites entries
  const groupedData = groupedDates.map((range, i) => {
    const startRange = range[0].getTime();
    const endRange = range[1].getTime();

    // There is already an undefined check above, so we can assert that city.views
    // is never undefined
    let rangeCount;

    if (type === "views") {
      rangeCount = data.views!.filter((entry) => {
        const viewEpoch = new Date(entry.viewedAt).getTime();
        return viewEpoch >= startRange && viewEpoch < endRange;
      }).length;
    } else if (type === "favorites") {
      rangeCount = data.favorites!.filter((entry) => {
        const viewEpoch = new Date(entry.favoritedAt).getTime();
        return viewEpoch >= startRange && viewEpoch < endRange;
      }).length;
    } else if (type === "uniqueViews") {
      rangeCount = uniqueViews.filter((entry) => {
        const viewEpoch = new Date(entry.viewedAt).getTime();
        return viewEpoch >= startRange && viewEpoch < endRange;
      }).length;
    }

    processedCounts += rangeCount ?? 0;
    
    if (i % progressInterval === 0) {
      send({
        type: "progress",
        payload: {progressPercentage: 100 * (processedCounts / totalToProcess)}
      });
    }

    // TODO: Switch to storing raw epoch, since its more robust
    //  + enable better separation of concerns
    return [range[0].getTime(), rangeCount];
  });
  return Object.fromEntries(groupedData);
}
