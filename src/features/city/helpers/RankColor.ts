import type {ScreenshotRank} from "../../../types/City.ts";

export function getRankColor(rank: ScreenshotRank) {
  if (rank === "diamond") return "#87CEEB";
  if (rank === "bronze") return "#CD7F32";
  if (rank === "gold") return "#ffc800";
  if (rank === "silver") return "gray";
  if (rank === "platinum") return "#98b1be";
}