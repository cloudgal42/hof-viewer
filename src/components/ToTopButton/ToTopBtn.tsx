import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {ArrowUp} from "react-bootstrap-icons";
import {useEffect, useState} from "react";

import "../../css/components/ToTopBtn.scss"

export const ToTopBtn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  function toggleVisibility() {
    if (window.scrollY > 700) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  function goToTop() {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    }
  }, []);

  return (
    <OverlayTrigger overlay={<Tooltip>Back to Top</Tooltip>}>
      <Button
        variant="primary"
        className={`${isVisible ? "visible" : ""} to-top-btn position-fixed p-0`}
        onClick={goToTop}
      >
        <span className="visually-hidden">Back to Top</span>
        <ArrowUp />
      </Button>
    </OverlayTrigger>
  )
}