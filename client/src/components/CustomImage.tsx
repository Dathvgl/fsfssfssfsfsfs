import { useState, SyntheticEvent } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

type CustomImageProps = {
  src?: string;
  className?: string;
};

function CustomImage(props: CustomImageProps) {
  const { src, className } = props;

  const [aspect, setAspect] = useState<number>();

  function onLoad(event: SyntheticEvent<HTMLImageElement, Event>) {
    const target = event.target as HTMLImageElement;
    const { width, height } = target;
    if (width > height) setAspect(() => 1);
    else setAspect(() => 0);
  }

  return (
    <div
      className={`w-full relative overflow-hidden lazy-load-image ${className}`}
    >
      <LazyLoadImage
        className={`absolute max-w-none transform ${
          aspect == 0 ? "w-full top-1/2 -translate-y-1/2" : ""
        }${aspect == 1 ? "h-full left-1/2 -translate-x-1/2" : ""}`}
        src={src}
        effect="black-and-white"
        alt="Error"
        onLoadCapture={onLoad}
      />
    </div>
  );
}

export default CustomImage;
