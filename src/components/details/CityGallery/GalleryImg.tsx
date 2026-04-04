import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../../assets/placeholder.svg";
import {type MouseEventHandler, type ReactNode, useState} from "react";

import "../../../css/components/GalleryImg.css";

interface GalleryItemProps {
  url: string;
  hoverCaptions?: ReactNode;
  height: string | number;
  onLoad?: () => void;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const GalleryImg = (
  {url, hoverCaptions, height, onLoad, onClick}: GalleryItemProps
) => {
  const [isError, setIsError] = useState<boolean>(false);

  if (isError) return (
    <div className="text-muted w-100 d-flex align-items-center justify-content-center">
      Oops... failed to load image :(
    </div>
  )

  return (
    <button
      className="city-gallery-item p-0 border-0 w-100 position-relative"
      style={{backgroundColor: "#868e96"}}
      onClick={onClick}
      aria-label="Open image on lightbox"
    >
      <LazyLoadImage
        className="w-100"
        src={url}
        effect="black-and-white"
        alt=""
        height={height}
        onLoad={onLoad}
        onError={() => setIsError(true)}
        placeholder={
          <img
            src={PlaceholderImg}
            className="w-100"
            height="150"
            style={{aspectRatio: "16/9"}}
            alt=""
          />
        }
      />
      {hoverCaptions && (
        <div className="captions text-truncate text-white p-1 position-absolute w-100 bg-opacity-50 d-flex justify-content-center bg-black gap-2">
          {hoverCaptions}
        </div>
      )}
    </button>
  )
}