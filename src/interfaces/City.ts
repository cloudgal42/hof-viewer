import type {Creator} from "./Creator.ts";
import type {Mod} from "./Mod.ts";

interface Views {
  id: string;
  viewedAt: string;
  creatorId: string;
  creator: Creator;
  screenshotId: string;
}

interface Favorites {
  id: string;
  favoritedAt: string;
  creatorId: string;
  creator: Creator;
  screenshotId: string;
}

export interface City {
  id: string;
  isApproved: boolean;
  isReported: boolean;
  favoritesCount: number;
  favoritingPercentage: number;
  viewsCount: number;
  uniqueViewsCount: number;
  cityName: string;
  cityNameLocale?: string;
  cityNameLatinized?: string;
  cityNameTranslated?: string;
  cityMilestone: number;
  cityPopulation: number;
  mapName?: string;
  imageUrlThumbnail: string;
  imageUrlFHD: string;
  imageUrl4K: string;
  shareParadoxModIds: boolean;
  paradoxModIds: number[];
  shareRenderSettings: boolean;
  creatorId: string;
  creator: Creator;
  createdAt: string;
  createdAtFormatted?: string;
  createdAtFormattedDistance: string;
  description?: string;
  renderSettings: object; // TODO: Maybe define an interface for this?
  showcasedMod?: Mod;
  showcasedModId?: number;
  favorites?: Favorites[];
  views?: Views[];
  __favorited: boolean;
}

export interface GroupedCities extends Omit<City, "imageUrlFHD" | "imageUrl4K" | "imageUrlThumbnail"> {
  imageUrlFHD: string[];
  imageUrl4K: string[];
  imageUrlThumbnail: string[];
}