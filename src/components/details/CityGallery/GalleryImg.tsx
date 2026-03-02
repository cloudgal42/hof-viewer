import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../../assets/placeholder.svg";
import type {LightGallery as ILightGallery} from 'lightgallery/lightgallery.d.ts';
import {type Dispatch, type Key, type RefObject, type SetStateAction, useState} from "react";
import {ErrorScreen} from "../../misc/ErrorScreen/ErrorScreen.tsx";

interface GalleryItemProps {
  url: string;
  galleryRef: RefObject<ILightGallery | null>;
  currImageUrls: string[];
  index: number;
  setIsImageLoaded: Dispatch<SetStateAction<boolean>>;
}

export const GalleryImg = (
  {url, galleryRef, index, currImageUrls, setIsImageLoaded}: GalleryItemProps
) => {
  const [isError, setIsError] = useState<boolean>(false);

  if (isError) return (
    <div className="text-muted w-100 d-flex align-items-center justify-content-center">
      Oops... failed to load image :(
    </div>
  )

  return (
    <div className="w-100" style={{backgroundColor: "#868e96"}}>
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
            style={{aspectRatio: "16/9"}}
            alt=""
          />
        }
        onClick={() => galleryRef?.current && galleryRef.current.openGallery(index)}
      />
    </div>
  )
}