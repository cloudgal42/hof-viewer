import { Badge } from "react-bootstrap";
import {
  CheckCircle,
  ExclamationTriangle,
  Heartbreak,
  QuestionCircle,
  XCircle,
} from "react-bootstrap-icons";
import type { SkyveCompatibility } from "../../types/SkyveCompatibility.ts";

export const SkyveCompatibilityBadge = (
  { compatibilityInfo }: { compatibilityInfo: SkyveCompatibility | null },
) => {
  if (
    !compatibilityInfo || compatibilityInfo.stability === "notEnoughInformation"
  ) {
    return (
      <Badge className="bg-secondary-subtle fw-semibold border border-1 border-secondary text-secondary-emphasis">
        <QuestionCircle className="me-1" />
        {compatibilityInfo?.stability === "notEnoughInformation"
          ? "Not enough information"
          : "No data"}
      </Badge>
    );
  }

  let badgeAndTextColor;
  let icon;
  let formattedStability;

  if (
    compatibilityInfo.stability === "cautionWhenUsing" ||
    compatibilityInfo.stability === "hasIssues"
  ) {
    icon = <ExclamationTriangle />;
  } else if (
    compatibilityInfo.stability === "brokenFromPatch" ||
    compatibilityInfo.stability === "broken"
  ) {
    icon = <XCircle />;
  } else if (
    compatibilityInfo.stability === "obsolete" ||
    compatibilityInfo.stability === "hasIssuesNoFutureUpdates"
  ) {
    icon = <Heartbreak />;
  } else {
    icon = <CheckCircle />;
  }

  if (
    compatibilityInfo.stability === "cautionWhenUsing" ||
    compatibilityInfo.stability === "hasIssues"
  ) {
    badgeAndTextColor =
      "bg-warning-subtle border-warning text-warning-emphasis";
  } else if (
    compatibilityInfo.stability === "brokenFromPatch" ||
    compatibilityInfo.stability === "broken" ||
    compatibilityInfo.stability === "obsolete" ||
    compatibilityInfo.stability === "hasIssuesNoFutureUpdates"
  ) {
    badgeAndTextColor = "bg-danger-subtle border-danger text-danger-emphasis";
  } else {
    badgeAndTextColor =
      "bg-success-subtle border-success text-success-emphasis";
  }

  if (compatibilityInfo.stability === "cautionWhenUsing") {
    formattedStability = "Attention Needed";
  } else if (compatibilityInfo.stability === "brokenFromPatch") {
    formattedStability = "Broken from Patch";
  } else if (compatibilityInfo.stability === "hasIssues") {
    formattedStability = "Has Issues";
  } else if (compatibilityInfo.stability === "hasIssuesNoFutureUpdates") {
    formattedStability = "Has Issues, no updates";
  } else {
    formattedStability = compatibilityInfo.stability.charAt(0).toUpperCase() +
      compatibilityInfo.stability.slice(1);
  }

  return (
    <Badge className={`fw-semibold border border-1 ${badgeAndTextColor}`}>
      {icon}
      <span className="ms-1">{formattedStability}</span>
    </Badge>
  );
};
