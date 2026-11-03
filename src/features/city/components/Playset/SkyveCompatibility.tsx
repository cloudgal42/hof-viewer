import { OverlayTrigger, Popover, PopoverBody } from "react-bootstrap";
import { CardImg } from "../../../../components/misc/CardImg/CardImg.tsx";
import { SkyveCompatibilityBadge } from "./SkyveCompatibilityBadge.tsx";
import type { Mod } from "../../types/Mod.ts";
import { useState } from "react";

export const SkyveCompatibility = (
  { mod }: { mod: Mod },
) => {
  const compatibilityInfo = mod.skyve;

  const [show, setShow] = useState(false);
  const [showType, setShowType] = useState<"hover" | "click">("hover");

  function handleShowClick() {
    if (showType === "hover" && show) {
      setShowType("click");
      setShow(true);
    } else {
      setShow(!show);
    }
  }

  function handleShowHover(showStatus: boolean) {
    setShow(showStatus);
    if (showType === "click") setShowType("hover");
  }

  return (
    <OverlayTrigger
      show={show}
      overlay={
        <Popover
          style={{ maxWidth: "300px" }}
          onMouseEnter={() => handleShowHover(true)}
          onMouseLeave={() => handleShowHover(false)}
        >
          <PopoverBody
            as="article"
            style={{ whiteSpace: "pre-wrap" }}
          >
            <section className="d-flex gap-3 mb-3 align-items-center">
              <div>
                <CardImg
                  width={64}
                  height={64}
                  style={{ aspectRatio: "1/1" }}
                  src={mod.thumbnailUrl}
                  alt=""
                  className="object-fit-cover"
                  effect="blur"
                />
              </div>
              <div>
                <h4 className="h6 mb-0">{mod.name}</h4>
                <p className="mb-1 text-secondary-emphasis">
                  by {mod.authorName}
                </p>
                <SkyveCompatibilityBadge compatibilityInfo={mod.skyve} />
              </div>
            </section>
            <section className="w-100">
              {compatibilityInfo?.note
                ? (
                  <>
                    <h5 className="h6">Compatibility Notes</h5>
                    <p className="ms-1 mb-2 ps-2 border-start border-3">
                      {compatibilityInfo.note}
                    </p>
                  </>
                )
                : !compatibilityInfo || compatibilityInfo.stability === "notEnoughInformation"
                ? (
                  <p className="mb-2">
                    <i>
                      There is not enough compatibility data for this package.
                    </i>
                  </p>
                )
                : (
                  <p className="mb-2">
                    <i>No compatibility notes</i>
                  </p>
                )}
              <p className="text-secondary-emphasis mb-0">
                {compatibilityInfo?.reviewedAt
                  ? `Last reviewed: ${
                    new Date(compatibilityInfo.reviewedAt).toLocaleString()
                  }`
                  : "Last reviewed: Date unknown"}
              </p>
            </section>
          </PopoverBody>
        </Popover>
      }
    >
      {/* This must be wrapped within a span to work. No idea why /shrug */}
      <span
        onClick={handleShowClick}
        onMouseEnter={() => handleShowHover(true)}
        onMouseLeave={() => handleShowHover(false)}
      >
        <SkyveCompatibilityBadge compatibilityInfo={mod.skyve} />
      </span>
    </OverlayTrigger>
  );
};
