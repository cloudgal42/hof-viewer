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
import type {City, GroupedCities} from "../../../interfaces/City.ts";
import {GalleryImg} from "./GalleryImg.tsx";
import {Eye, Heart} from "react-bootstrap-icons";

interface GalleryProps {
  city: City | GroupedCities;
  // imageUrls: string[];
  page: number;
}

export const DEFAULT_IMAGES_PER_PAGE = 12;

const CityGallery = ({city, page}: GalleryProps) => {
  const galleryRef = useRef<ILightGallery>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const lightboxItems = ("cities" in city) ?
    [...city.cities]
      .sort((a, b) => {
        const cityADate = new Date(a.createdAt).getTime();
        const cityBDate = new Date(b.createdAt).getTime();
        return cityBDate - cityADate;
      })
      .map(entry => {
        return {
          src: entry.imageUrl4K,
          alt: "",
          thumb: entry.imageUrlThumbnail,
          cityRef: entry,
          subHtml: city.imageUrlFHD.length > 1 ? `
            <span>
              Posted on ${new Date(entry.createdAt).toLocaleString()} (${entry.createdAtFormattedDistance}).<br /> 
              Views: ${entry.viewsCount} (Unique: ${entry.uniqueViewsCount}) | Favorites: ${entry.favoritesCount} |
              <a href="/city/${entry.id}?groupStatus=off" target="_blank">
                Details (opens in new tab)
              </a>
            </span>
         ` : ""
        }
      })
    : [{
      src: city.imageUrl4K,
      alt: "",
      cityRef: city,
    }]
  const currImageUrls = lightboxItems.toSpliced(page * DEFAULT_IMAGES_PER_PAGE);

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
        style={lightboxItems.length < 4 && !isImageLoaded ? {aspectRatio: "16/9"} : {}}
        className={`w-100 d-flex gap-1 flex-row flex-wrap ${currImageUrls.length > 4 ? "img-gallery-container-multiple" : "img-gallery-container"}`}
      >
        {currImageUrls.map((entry, i) => (
          <GalleryImg
            url={entry.src}
            height={currImageUrls.length > 4 ? "150" : ""}
            key={i}
            onLoad={() => setIsImageLoaded(true)}
            onClick={() => handleOpenGallery(i)}
            hoverCaptions={("cities" in city && city.imageUrlFHD.length > 1) &&
              <>
                <span className="d-flex align-items-center gap-1">
                  <Heart /> {entry.cityRef.favoritesCount.toLocaleString()}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Eye /> {entry.cityRef.viewsCount.toLocaleString()}
                </span>
              </>
            }
          />
        ))}
      </div>
      <div className="App">
        <LightGallery
          mobileSettings={{showCloseIcon: true}}
          allowMediaOverlap={true}
          toggleThumb={lightboxItems.length > 1}
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