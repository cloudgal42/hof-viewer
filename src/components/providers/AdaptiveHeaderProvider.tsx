import {type ReactNode, useEffect, useState} from "react";
import {AdaptiveHeaderContext} from "../../context/AdaptiveHeaderContext.ts";

export const AdaptiveHeaderProvider = (
  {children}: { children: ReactNode }
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
    <AdaptiveHeaderContext value={headerCollapsed}>
      {children}
    </AdaptiveHeaderContext>
  )
}