import LightGallery from 'lightgallery/react';
import type {LightGallery as ILightGallery} from 'lightgallery/lightgallery.d.ts';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-autoplay.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgAutoplay from 'lightgallery/plugins/autoplay';

import {LazyLoadImage} from "react-lazy-load-image-component";
import PlaceholderImg from "../../assets/placeholder.svg";
import {useCallback, useRef} from "react";
import type {InitDetail} from "lightgallery/lg-events";
import type {GalleryItem} from "lightgallery/lg-utils";
import type {City, GroupedCities} from "../../interfaces/City.ts";

interface GalleryProps {
  city: City | GroupedCities;
  // imageUrls: string[];
  page: number;
}

export const DEFAULT_IMAGES_PER_PAGE = 12;

const CityGallery = ({city, page}: GalleryProps) => {
  const galleryRef = useRef<ILightGallery>(null);

  const imageUrls = ("cities" in city) ?
    city.cities.map(city => city.imageUrlFHD)
    : [city.imageUrlFHD];
  const currImageUrls = imageUrls.toSpliced(page * DEFAULT_IMAGES_PER_PAGE);
  const lightboxItems: GalleryItem[] = ("cities" in city) ?
    city.cities.map(city => {
      return {
        src: city.imageUrlFHD,
        alt: "",
        thumb: city.imageUrlFHD,
        subHtml: `
          <span class="text-muted" style="font-size: 0.9rem">
            Posted on ${new Date(city.createdAt).toLocaleString()} (${city.createdAtFormattedDistance}).<br /> 
            Views: ${city.viewsCount} (Unique: ${city.uniqueViewsCount}) | Favorites: ${city.favoritesCount} |
            <a href="/city/${city.id}?groupStatus=off" target="_blank">
              Details (opens in new tab)
            </a>
          </span>
        `
      }
    }) : imageUrls.map(imageUrl => {
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
          plugins={[lgThumbnail, lgZoom, lgFullscreen, lgAutoplay]}
          dynamic={true}
          dynamicEl={lightboxItems}
          licenseKey="0000-0000-000-000" // FIXME
        />
      </div>
    </>
  )
}

export default CityGallery;