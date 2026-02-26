import {type ReactNode, useEffect, useState} from "react";

import "../../../css/components/AdaptiveHeader.scss";

export const AdaptiveHeader = (
  {children} : {children: ReactNode}
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
    <div className={headerCollapsed ? " header-collapsed" : "adaptive-header"}>
      <div className="header-collapsed-body main-wrapper m-auto">
        {children}
      </div>
    </div>
  )
}