interface SocialPlatform {
  platform: string;
  link: string;
  clicks: number;
}

export interface Creator {
  id: string;
  creatorName: string;
  creatorNameSlug: string;
  creatorNameLocale?: string;
  creatorNameLatinized?: string;
  creatorNameTranslated?: string;
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