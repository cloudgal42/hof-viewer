import { type ReactNode, useEffect, useState } from "react";

import "../../../css/components/AdaptiveHeader.scss";

export const AdaptiveHeader = (
  {children, className} : {children: ReactNode, className?: string}
) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  
  useEffect(() => {
    function checkScrollYPos() {
      if (window.scrollY >= 70) {
        setHeaderCollapsed(true);
      } else {
        setHeaderCollapsed(false);
      }
    }

    window.addEventListener("scroll", checkScrollYPos);

    return () => window.removeEventListener("scroll", checkScrollYPos);
  }, []);

  return (
    <>
      <div
        className={headerCollapsed ? " header-collapsed" : "adaptive-header"}
      >
        <div className={`main-wrapper m-auto ${className}`}>
          {children}
        </div>
      </div>
    </>
  );
};
