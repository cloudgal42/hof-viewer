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