import React from 'react';

export const Image = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>((props, ref) => {
  return <img ref={ref} {...props} />;
});

Image.displayName = 'Image';
