import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import Carousel from 'react-bootstrap/Carousel';

interface GalleryProps {
  imageUrls: string[];
}

export const CityGallery = ({imageUrls}: GalleryProps) => {
  function onInit() {
    console.log("lightGallery initialized");
    console.log(`Image URLs length: ${imageUrls.length}`);
  }

  return (
    <div className="App">
      <Carousel interval={null} fade>
        {imageUrls.map((url, i) => (
          <Carousel.Item>
            <LightGallery
              onInit={onInit}
              speed={500}
              plugins={[lgThumbnail, lgZoom]}
            >
              <a key={i} className="flex-grow-0" href={url}>
                <img
                  className="w-100 rounded"
                  key={i}
                  src={url}
                  alt=""
                />
              </a>
            </LightGallery>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}