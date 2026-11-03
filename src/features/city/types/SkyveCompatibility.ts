export interface SkyveCompatibility {
  stability: string;
  // TODO: Check if this returns undefined or null
  note?: string;
  reviewedAt: string | null;
  reviewedAtFormattedDistance: string | null;
  reviewedGameVersion: string | null;
}