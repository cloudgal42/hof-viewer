interface SocialPlatform {
  platform: string;
  link: string;
  clicks: number;
}

export interface Creator {
  id: string;
  creatorName: string;
  creatorNameSlug: string;
  creatorNameLocale?: string | null;
  creatorNameLatinized?: string | null;
  creatorNameTranslated?: string | null;
  createdAt: string;
  socials: SocialPlatform[];
}

export interface CreatorDetails extends Creator {
  // Stats (stats starting with all will not be used)
  allCreatorsCount: number;
  allScreenshotsCount: number;
  allViewsCount: number;
  screenshotsCount: number;
  viewsCount: number;
  uniqueViewsCount: number;
  favoritesCount: number;
}