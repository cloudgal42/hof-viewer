import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../../assets/placeholder.svg";
import {type Dispatch, type MouseEventHandler, type SetStateAction, useState} from "react";

interface GalleryItemProps {
  url: string;
  currImageUrls: string[];
  setIsImageLoaded: Dispatch<SetStateAction<boolean>>;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const GalleryImg = (
  {url, currImageUrls, setIsImageLoaded, onClick}: GalleryItemProps
) => {
  const [isError, setIsError] = useState<boolean>(false);

  if (isError) return (
    <div className="text-muted w-100 d-flex align-items-center justify-content-center">
      Oops... failed to load image :(
    </div>
  )

  return (
    <button
      className="p-0 border-0 w-100"
      style={{backgroundColor: "#868e96"}}
      onClick={onClick}
      aria-label="Open image on lightbox"
    >
      <LazyLoadImage
        className="w-100"
        src={url}
        effect="black-and-white"
        alt=""
        height={currImageUrls.length > 4 ? "150" : ""}
        onLoad={() => setIsImageLoaded(true)}
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
    </button>
  )
}