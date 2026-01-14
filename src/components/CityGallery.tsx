import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import Carousel from 'react-bootstrap/Carousel';
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Card} from "react-bootstrap";
import PlaceholderImg from "../assets/placeholder.svg";

interface GalleryProps {
  imageUrls: string[];
}

export const CityGallery = ({imageUrls}: GalleryProps) => {
  function onInit() {

  }

  return (
    <div className="App">
      <Carousel interval={null} fade>
        {imageUrls.map((url, i) => (
          <Carousel.Item key={i}>
            <LightGallery
              onInit={onInit}
              key={i}
              speed={500}
              plugins={[lgThumbnail, lgZoom]}
              licenseKey="0000-0000-000-000" // FIXME
            >
              <a key={i} className="flex-grow-0" href={url}>
                <LazyLoadImage
                  className="w-100 rounded"
                  key={i}
                  src={url}
                  effect="black-and-white"
                  alt=""
                  placeholder={
                    <Card.Img variant="top" src={PlaceholderImg}/>
                  }
                />
              </a>
            </LightGallery>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}