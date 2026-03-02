import {type CSSProperties, useState} from "react";
import PlaceholderImg from "../../../assets/placeholder.svg";
import {type Effect, LazyLoadImage} from "react-lazy-load-image-component";

interface CardImgTopProps {
  wrapperClassName?: string;
  className?: string;
  src: string;
  style?: CSSProperties;
  alt: string;
  height?: number | string;
  width?: number | string;
  effect: Effect | undefined;
}

export const CardImg = (props: CardImgTopProps) => {
  const [isError, setIsError] = useState<boolean>(false);

  if (isError) return (
    <div style={{height: props.height + "px"}} className="text-muted w-100 d-flex align-items-center justify-content-center">
      Oops... failed to load image :(
    </div>
  )

  return (
    <LazyLoadImage
      {...props}
      onError={() => setIsError(true)}
      placeholder={
        <img src={PlaceholderImg} alt=""/>
      }
    />
  )
}