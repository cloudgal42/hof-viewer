import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../../../assets/placeholder.svg";
import {type MouseEventHandler, type ReactNode, useEffect, useRef, useState} from "react";

import "./GalleryImg.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

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
  const [currUrl, setCurrUrl] = useState<string>(url);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  
  const [isError, setIsError] = useState<boolean>(false);
  const [showTransition, setShowTransition] = useState<boolean>(false);
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (url !== currUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNextUrl(url);
      // This timeout exists since we want to only dim the stale image if
      //  the new image takes a while to load. Otherwise, there would be the
      //  "flicker" problem that the older implementation always have had.
      timerRef.current = setTimeout(() => {
        if (!nextUrl) {
          console.log("Image transition is running")
          setShowTransition(true);
        }
      }, 67);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [url, currUrl]);
  
  if (isError) return (
    <button
      style={{height: height, aspectRatio: "16/9"}}
      className="city-gallery-item p-0 border-0 bg-body text-muted w-100 d-flex align-items-center justify-content-center"
      disabled
    >
      Oops... failed to load image :(
    </button>
  );
  
  return (
    <button
      className="city-gallery-item p-0 border-0 w-100 position-relative"
      style={{backgroundColor: "#868e96"}}
      onClick={onClick}
      aria-label="Open image on lightbox"
    >
      {nextUrl && (
        <LazyLoadImage
          wrapperClassName="w-100 position-absolute z-2"
          effect="opacity"
          className="w-100"
          onError={() => setIsError(true)}
          height={height}
          src={nextUrl}
          onLoad={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setShowTransition(false);
          }}
          wrapperProps={{
            onTransitionEnd: () => {
              setCurrUrl(url);
              setNextUrl(null);
            }
          }}
        />
      )}
      <LazyLoadImage
        wrapperClassName={`curr-img w-100 ${showTransition ? "opacity-50" : ""}`}
        className="w-100"
        src={currUrl}
        effect="opacity"
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
        <div
          className="captions text-truncate text-white p-1 position-absolute w-100 bg-opacity-50 d-flex justify-content-center bg-black gap-2">
          {hoverCaptions}
        </div>
      )}
    </button>
  )
}