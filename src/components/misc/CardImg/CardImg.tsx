import type {CSSProperties} from "react";
import PlaceholderImg from "../../../assets/placeholder.svg";
import {LazyLoadImage} from "react-lazy-load-image-component";

interface CardImgTopProps {
  wrapperClassName?: string;
  className?: string;
  src: string;
  style?: CSSProperties;
  alt: string;
  effect: string;
}

export const CardImgTop = (
  props: {wrapperClassName, className, src, style, alt, effect}
) => {
  <LazyLoadImage
    {...props}
    placeholder={
      <img src={PlaceholderImg} alt=""/>
    }
  />
}