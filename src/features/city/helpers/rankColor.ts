import type {ScreenshotRank} from "../../../types/City.ts";

export function getRankColor(rank: ScreenshotRank) {
  if (rank === "diamond") return "#70b8d7";
  if (rank === "bronze") return "#CD7F32";
  if (rank === "gold") return "#dbaf14";
  if (rank === "silver") return "gray";
  if (rank === "platinum") return "#98b1be";
}
