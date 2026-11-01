import type { ScreenshotRank } from "../../../interfaces/City.ts";
import { Gem, Question, StarFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getRankColor } from "../../../utils/RankColor.ts";

export const ScreenshotRankBadge = (
  { rank, size }: { rank: ScreenshotRank; size?: number },
) => (
  <OverlayTrigger
    overlay={
      <Tooltip>
        {rank
          ? "Rank: " + rank.charAt(0).toUpperCase() + rank.slice(1, rank.length)
          : "No rank"}
      </Tooltip>
    }
  >
    {rank === "diamond"
      ? <Gem size={size} color="#87CEEB" />
      : rank === null
      ? <Question
          color="gray"
          className="border border-2 rounded-circle"
          size={size}
        />
      : (
        <StarFill
          size={size}
          className={`rounded-circle ${
            size && size > 24 ? "p-2" : "p-1"
          } border-2`}
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: getRankColor(rank),
          }}
          color={getRankColor(rank)}
        />
      )}
  </OverlayTrigger>
);
