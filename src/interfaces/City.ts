import type {Creator} from "./Creator.ts";
import type {Mod} from "./Mod.ts";

export interface Views {
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

// TODO: Make a new AnyCity type

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
  renderConditions: RenderConditions;
  showcasedMod?: Mod;
  showcasedModId?: number;
  favorites?: Favorites[];
  views?: Views[];
  __favorited: boolean;
}

// May not accurately reflect the schema.
export type RenderConditions = {
  "time.hour": number
  "time.isOverridden": boolean
  "time.dayOfYear": number
  "map.latitude": number
  "map.longitude": number
  "city.theme": string
  "climate.name": string
  "climate.season": string
  "climate.temperature": number
  "climate.cloudiness": number
  "climate.precipitation": number
  "climate.fog": number
  "climate.aurora": number
  "climate.isRaining": boolean
  "climate.isSnowing": boolean
  "climate.weather": string
  "sun.elevation": number
  "sun.elevationCapStart": number
  "sun.elevationCap": number
  "light.dayPhase": string
  "post.exposure": number
  "post.contrast": number
  "post.saturation": number
  "post.hueShift": number
  "post.temperature": number
  "post.tint": number
  "post.tonemapping": string
  "exposure.mode": string
  "exposure.compensation": number
  "options.dayNightVisuals": boolean
  "options.snowVisuals": boolean
  "graphics.globalIllumination": string
  "graphics.ambientOcclusion": string
  "graphics.reflections": string
  "graphics.shadows": string
  "graphics.volumetrics": string
  "graphics.clouds": string
  "graphics.fog": string
  "camera.fieldOfView": number
  "camera.x": number
  "camera.y": number
  "camera.z": number
  "camera.pitch": number
  "camera.heading": number
  "camera.roll": number
  "camera.heightAboveGround": number
  "capture.isDlssForcedOff": boolean
  "capture.isDynamicResolutionForcedOff": boolean
  "capture.isGlobalIlluminationForcedOff": boolean
} | Record<string, never>


export interface GroupedCities extends Omit<City, "imageUrlFHD" | "imageUrl4K" | "imageUrlThumbnail"> {
  imageUrlFHD: string[];
  imageUrl4K: string[];
  imageUrlThumbnail: string[];
  cities: City[];
  isUsingCustomOverrideSettings: boolean;
}