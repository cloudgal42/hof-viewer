import LightGallery from 'lightgallery/react';
import type {LightGallery as ILightGallery} from 'lightgallery/lightgallery.d.ts';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../assets/placeholder.svg";
import {useCallback, useRef} from "react";
import type {InitDetail} from "lightgallery/lg-events";
import type {GalleryItem} from "lightgallery/lg-utils";

interface GalleryProps {
  imageUrls: string[];
  page: number;
}

export const DEFAULT_IMAGES_PER_PAGE = 12;

const CityGallery = ({imageUrls, page}: GalleryProps) => {
  const galleryRef = useRef<ILightGallery>(null);

  const currImageUrls = imageUrls.toSpliced(page * DEFAULT_IMAGES_PER_PAGE);
  const lightboxItems: GalleryItem[] = imageUrls.map(imageUrl => {
    return {
      src: imageUrl,
      alt: "",
      // TODO: Use imageUrlThumbnail for thumbnails
      thumb: imageUrl,
    }
  })

  const onInit = useCallback((detail: InitDetail) => {
    if (detail) {
      galleryRef.current = detail.instance;
    }
  }, [])

  return (
    <>
      <div className={`d-flex gap-1 flex-row flex-wrap ${currImageUrls.length > 4 ? "img-gallery-container-multiple" : "img-gallery-container"}`}>
        {currImageUrls.map((url, i) => (
          <div key={i} style={{backgroundColor: "#868e96"}}>
            <LazyLoadImage
              className="w-100"
              key={i}
              src={url}
              effect="black-and-white"
              alt=""
              height={currImageUrls.length > 4 ? "150" : ""}
              placeholder={
                <img
                  src={PlaceholderImg}
                  className="w-100"
                  style={{aspectRatio: "16/9"}}
                  alt=""
                />
            }
              onClick={() => galleryRef.current && galleryRef.current.openGallery(i)}
            />
          </div>
        ))}
      </div>
      <div className="App">
        <LightGallery
          onInit={onInit}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          dynamic={true}
          dynamicEl={lightboxItems}
          licenseKey="0000-0000-000-000" // FIXME
        />
      </div>
    </>
  )
}

export default CityGallery;