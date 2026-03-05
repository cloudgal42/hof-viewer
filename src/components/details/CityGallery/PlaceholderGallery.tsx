import {DEFAULT_IMAGES_PER_PAGE} from "./CityGallery.tsx";
import PlaceholderImg from "../../../assets/placeholder.svg";

export const PlaceholderGallery = () => (
  <div className="w-100 d-flex gap-1 flex-row flex-wrap img-gallery-container-multiple">
    {Array.from({length: DEFAULT_IMAGES_PER_PAGE}).map((emptyItem, i) => (
      <button
        className="p-0 border-0 w-100"
        key={i}
        style={{aspectRatio: "16/9"}}
        disabled={true}
      >
        <img
          src={PlaceholderImg}
          alt=""
          height="150"
          className="w-100"
          style={{aspectRatio: "16/9"}}
        />
      </button>
    ))}
  </div>
)