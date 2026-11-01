import type {ScreenshotRank} from "../interfaces/City.ts";

export function getRankColor(rank: ScreenshotRank) {
  if (rank === "diamond") return "#87CEEB";
  if (rank === "bronze") return "#CD7F32";
  if (rank === "gold") return "gold";
  if (rank === "silver") return "gray";
  if (rank === "platinum") return "#bfcfd7";
}