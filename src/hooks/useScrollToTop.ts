import {useEffect} from "react";

export const useScrollToTop = () => {
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);
}