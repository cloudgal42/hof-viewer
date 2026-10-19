import type { SkyveCompatibility } from "../../../interfaces/SkyveCompatibility.ts";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import skyveIcon from "../../../assets/skyve.webp";
import {
  Check,
  CheckCircle,
  ExclamationTriangle,
  Heartbreak,
  Question,
  QuestionCircle,
  XCircle,
} from "react-bootstrap-icons";

export const SkyveCompatibilityBadge = (
  { compatibilityInfo }: { compatibilityInfo: SkyveCompatibility | null },
) => {
  if (!compatibilityInfo) {
    return (
      <OverlayTrigger
        overlay={
          <Tooltip>
            There is not enough compatibility data for this package.
          </Tooltip>
        }
      >
        <Badge className="bg-secondary-subtle fw-semibold border border-1 border-secondary text-secondary-emphasis">
          <QuestionCircle className="me-1" />
          No data
        </Badge>
      </OverlayTrigger>
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
  } else if (compatibilityInfo.stability === "obsolete")
    icon = <Heartbreak />;
  else {
    icon = <CheckCircle />;
  }

  if (
    compatibilityInfo.stability === "cautionWhenUsing" ||
    compatibilityInfo.stability === "hasIssues"
  ) {
    badgeAndTextColor = "bg-warning-subtle border-warning text-warning";
  } else if (
    compatibilityInfo.stability === "brokenFromPatch" ||
    compatibilityInfo.stability === "broken" ||
    compatibilityInfo.stability === "obsolete"
  ) {
    badgeAndTextColor = "bg-danger-subtle border-danger text-danger";
  } else {
    badgeAndTextColor = "bg-success-subtle border-success text-success";
  }
  
  if (compatibilityInfo.stability === "cautionWhenUsing") {
    formattedStability = "Attention Needed";
  } else if (compatibilityInfo.stability === "brokenFromPatch") {
    formattedStability = "Broken from Patch";
  } else if (compatibilityInfo.stability === "hasIssues") {
    formattedStability = "Has Issues";
  } else {
    formattedStability = compatibilityInfo.stability.charAt(0).toUpperCase() +
    compatibilityInfo.stability.slice(1)
  }

  return (
    <OverlayTrigger
      overlay={
        <Tooltip>
          <ul className="list-unstyled mb-0">
            <li>
              <strong>Compatibility notes:</strong>{" "}
              {compatibilityInfo.note ?? "None"}
            </li>
            <li>
              <strong>Reviewed at:</strong> {compatibilityInfo.reviewedAt
                ? new Date(compatibilityInfo.reviewedAt).toLocaleDateString()
                : "Unknown"}
            </li>
          </ul>
        </Tooltip>
      }
    >
      <Badge className={`fw-semibold border border-1 ${badgeAndTextColor}`}>
        {icon}
        <span className="ms-1">{formattedStability}</span>
      </Badge>
    </OverlayTrigger>
  );
};
