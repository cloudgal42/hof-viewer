import type {SkyveCompatibility} from "./SkyveCompatibility.ts";

export interface Mod {
  id: string;
  paradoxModId: number;
  name: string;
  authorName: string;
  shortDescription: string;
  thumbnailUrl: string;
  tags: string[];
  subscribersCount: number;
  knownLastUpdatedAt: string;
  skyve: SkyveCompatibility | null;
}