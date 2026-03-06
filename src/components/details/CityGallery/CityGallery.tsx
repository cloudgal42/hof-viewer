import LightGallery from 'lightgallery/react';
import type {LightGallery as ILightGallery} from 'lightgallery/lightgallery.d.ts';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-autoplay.css';

import '../../../css/components/CityGallery.scss';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgAutoplay from 'lightgallery/plugins/autoplay';

import {useCallback, useRef, useState} from "react";
import type {InitDetail} from "lightgallery/lg-events";
import type {GalleryItem} from "lightgallery/lg-utils";
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {GalleryImg} from "./GalleryImg.tsx";

interface GalleryProps {
  city: City | GroupedCities;
  // imageUrls: string[];
  page: number;
}

export const DEFAULT_IMAGES_PER_PAGE = 12;

const CityGallery = ({city, page}: GalleryProps) => {
  const galleryRef = useRef<ILightGallery>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const imageUrls = ("cities" in city) ?
    [...city.cities]
      .sort((a, b) => {
        const cityADate = new Date(a.createdAt).getTime();
        const cityBDate = new Date(b.createdAt).getTime();
        return cityBDate - cityADate;
      })
      .map(entry =>
        (city.imageUrlFHD.length > 4) ? entry.imageUrlThumbnail : entry.imageUrlFHD
      )
    : [city.imageUrlFHD];
  const currImageUrls = imageUrls.toSpliced(page * DEFAULT_IMAGES_PER_PAGE);
  const lightboxItems: GalleryItem[] = ("cities" in city) ?
    [...city.cities]
      .sort((a, b) => {
        const cityADate = new Date(a.createdAt).getTime();
        const cityBDate = new Date(b.createdAt).getTime();
        return cityBDate - cityADate;
      })
      .map(city => {
        return {
          src: city.imageUrl4K,
          alt: "",
          thumb: city.imageUrlThumbnail,
          subHtml: `
            <span>
              Posted on ${new Date(city.createdAt).toLocaleString()} (${city.createdAtFormattedDistance}).<br /> 
              Views: ${city.viewsCount} (Unique: ${city.uniqueViewsCount}) | Favorites: ${city.favoritesCount} |
              <a href="/city/${city.id}?groupStatus=off" target="_blank">
                Details (opens in new tab)
              </a>
            </span>
         `
        }
      })
    : [{
      src: city.imageUrl4K,
      alt: ""
    }]

  const onInit = useCallback((detail: InitDetail) => {
    if (detail) {
      galleryRef.current = detail.instance;
    }
  }, []);

  function handleOpenGallery(index: number) {
    if (galleryRef.current) {

      if (galleryRef.current.galleryItems.length === 0) {
        galleryRef.current.refresh(lightboxItems);
      }
      galleryRef.current.openGallery(index);
    }
  }

  return (
    <>
      <div
        style={imageUrls.length < 4 && !isImageLoaded ? {aspectRatio: "16/9"} : {}}
        className={`w-100 d-flex gap-1 flex-row flex-wrap ${currImageUrls.length > 4 ? "img-gallery-container-multiple" : "img-gallery-container"}`}
      >
        {currImageUrls.map((url, i) => (
          <GalleryImg
            url={url}
            currImageUrls={currImageUrls}
            setIsImageLoaded={setIsImageLoaded}
            key={i}
            onClick={() => handleOpenGallery(i)}
          />
        ))}
      </div>
      <div className="App">
        <LightGallery
          mobileSettings={{showCloseIcon: true}}
          allowMediaOverlap={true}
          toggleThumb={true}
          mousewheel={true}
          onInit={onInit}
          speed={500}
          plugins={[lgThumbnail, lgZoom, lgFullscreen, lgAutoplay]}
          dynamic={true}
          dynamicEl={[]}
          licenseKey="0000-0000-000-000" // FIXME
        />
      </div>
    </>
  )
}

export default CityGallery;