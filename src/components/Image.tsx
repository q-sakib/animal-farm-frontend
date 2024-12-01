import React from 'react';
import Image from 'next/image';

type ImagePreviewProps = {
  imageUrl: string;
  altText: string;
  width?: number;
  height?: number;
  className?: string;
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, altText, width, height, className }) => {
  return (
    <Image
      loading="lazy"
      src={imageUrl}
      alt={altText}
      width={width || 320}
      height={height || 382}
      className={className}
    />
  );
};
