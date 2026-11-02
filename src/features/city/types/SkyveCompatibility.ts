export interface SkyveCompatibility {
  stability: string;
  // TODO: Check if this returns undefined or null
  note?: string;
  reviewedAt: Date | null;
  reviewedAtFormattedDistance: string | null;
  reviewedGameVersion: string | null;
}