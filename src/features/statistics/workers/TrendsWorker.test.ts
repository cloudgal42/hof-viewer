import "@vitest/web-worker";
import {describe, it, expect} from "vitest";

import sampleViews from "./views.data.json";
import sampleFavorites from "./favorites.data.json";
import type {WorkerMsg, WorkerParams} from "../types/TrendsData.ts";

describe("Trends worker - Cumulative count must be equal in length to the expected amount", () => {
  async function getActualOutputCount(params: WorkerParams, worker: Worker) {
    return new Promise<number>(resolve => {
      worker.onmessage = (e: MessageEvent<WorkerMsg>) => {
        if (e.data.type === "calculationCompleted") {
          const {payload} = e.data;
          resolve(Object.entries(payload)
            .reduce((acc, [k, v]) => acc + v, 0));
        }
      }
      worker.postMessage(params);
    })
  }
  
  async function testVariousGroupPeriods(params: WorkerParams, worker: Worker, expectedLength: number) {
    // Group by a day
    params.period = "day";
    const result1 = await getActualOutputCount(params, worker);
    expect(result1, `Group by 1 day`)
      .toBe(expectedLength);
    
    // Group by one week
    params.period = "week";
    const result2 = await getActualOutputCount(params, worker);
    expect(result2, `Group by 1 week`)
      .toBe(expectedLength);
    
    // Group by one month
    params.period = "month";
    const result3 = await getActualOutputCount(params, worker);
    expect(result3, `Group by 1 month:`)
      .toBe(expectedLength);
    
    // Group by 6 months
    params.period = "halfyear";
    const result4 = await getActualOutputCount(params, worker);
    expect(result4, `Group by 6 months:`)
      .toBe(expectedLength);
    
    // Group by 1 year
    params.period = "year";
    const result5 = await getActualOutputCount(params, worker);
    expect(result5, `Group by 1 year:`)
      .toBe(expectedLength);
  }
  
  it("should return views data with total count that is equals to the input", async () => {
    const worker = new Worker(new URL("./TrendsWorker.ts", import.meta.url));
    
    const params = {
      inputData: {
        createdAt: "2024-12-31T19:02:27.331Z",
        views: sampleViews,
        favorites: sampleFavorites
      },
      period: "day" as const,
      type: "views",
    };
    
    const expectedLength = sampleViews.length;
    
    await testVariousGroupPeriods(params, worker, expectedLength);
  })
  it("should return unique views data with total count that is not equal to the raw input, but is equal to the unique views count", async () => {
    const worker = new Worker(new URL("./TrendsWorker.ts", import.meta.url));
    
    const params = {
      inputData: {
        createdAt: "2024-12-31T19:02:27.331Z",
        views: sampleViews,
        favorites: sampleFavorites
      },
      period: "day" as const,
      type: "uniqueViews",
    };
    
    // 272. CreatorID and ScreenshotID is combined as someone may have viewed multiple screenshots of the one creator.
    const expectedLength = [...new Set(sampleViews.map(v => v.creatorId + v.screenshotId))].length;
    
    await testVariousGroupPeriods(params, worker, expectedLength);
  })
  it('should return favorites data with total count that is equals to the input', async () => {
    const worker = new Worker(new URL("./TrendsWorker.ts", import.meta.url));
    
    const params = {
      inputData: {
        createdAt: "2024-12-31T19:02:27.331Z",
        views: sampleViews,
        favorites: sampleFavorites
      },
			period: "day" as const,
			type: "favorites",
    };
    
    const expectedLength = sampleFavorites.length;
    
    await testVariousGroupPeriods(params, worker, expectedLength);
  });
})
