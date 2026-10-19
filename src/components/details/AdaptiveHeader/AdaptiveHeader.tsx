import {type ReactNode, useRef, useState} from "react";
import { motion } from "motion/react";

import "../../../css/components/AdaptiveHeader.scss";
import {useEventListener, useResizeObserver} from "usehooks-ts";

export const AdaptiveHeader = (
  {children, className, minY} : {children: ReactNode, className?: string, minY: number}
) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  
  const ogHeaderRef = useRef<HTMLDivElement>(null);
  const {width = 0} = useResizeObserver({
    // @ts-expect-error ref See https://github.com/juliencrn/usehooks-ts/issues/681
    ref: ogHeaderRef, box: "border-box"
  });
  
  useEventListener("scroll", () => {
    if (window.scrollY >= minY) {
      setHeaderCollapsed(true);
    } else {
      setHeaderCollapsed(false);
    }
  });

  return (
    <>
      <div
        className="adaptive-header"
        ref={ogHeaderRef}
        aria-hidden={headerCollapsed}
      >
        <div className={`main-wrapper m-auto ${className}`}>
          {children}
        </div>
      </div>
      {headerCollapsed && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{
            duration: 0.25,
          }}
          className={`header-collapsed`}
          style={{width: width + "px", height: headerCollapsed ? "auto" : "1px"}}
          aria-hidden={!headerCollapsed}
        >
          <div className={`main-wrapper m-auto ${className}`}>
            {children}
          </div>
        </motion.div>
      )}
    </>
  );
};
