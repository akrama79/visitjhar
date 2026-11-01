import React, { useState } from 'react';
import { normalizeImageUrl, handleImageError, getCategoryPlaceholder } from '../lib/imageUtils';

export interface DestinationImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  category?: string | null;
  pillar?: string | null;
  targetSize?: 500 | 960 | 1280;
  fallbackSrc?: string;
  className?: string;
}

export const DestinationImage: React.FC<DestinationImageProps> = ({
  src,
  alt,
  category,
  pillar,
  targetSize = 960,
  fallbackSrc,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Determine the category-specific placeholder
  const categoryFallback = fallbackSrc || getCategoryPlaceholder(category, pillar);
  
  // Normalize source URL
  const normalizedSrc = normalizeImageUrl(src, targetSize);
  
  // If no source was provided or error occurred, use the category placeholder
  const effectiveSrc = hasError || !src ? categoryFallback : normalizedSrc;

  return (
    <img
      {...props}
      src={effectiveSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
        }
        handleImageError(e, categoryFallback);
      }}
    />
  );
};
