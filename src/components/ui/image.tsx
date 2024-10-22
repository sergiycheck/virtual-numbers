import React, { useRef } from "react";

interface Props extends React.ComponentProps<"img"> {
  fallbackImg?: string;
}

function Image({ fallbackImg = "/no-image.svg", ...props }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    if (imgRef.current) {
      imgRef.current.src = fallbackImg;
    }
  };

  return <img ref={imgRef} onError={handleError} {...props} />;
}

export default Image;
