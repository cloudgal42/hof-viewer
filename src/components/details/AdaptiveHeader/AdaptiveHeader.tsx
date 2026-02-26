import {type ReactNode, useContext, useEffect, useState} from "react";

import "../../../css/components/AdaptiveHeader.scss";
import {AdaptiveHeaderContext} from "../../../context/AdaptiveHeaderContext.ts";

export const AdaptiveHeader = (
  {children} : {children: ReactNode}
) => {
  const headerCollapsed = useContext(AdaptiveHeaderContext);
  return (
    <div className={headerCollapsed ? " header-collapsed" : "adaptive-header"}>
      <div className="header-collapsed-body main-wrapper m-auto">
        {children}
      </div>
    </div>
  )
}