import React, { useState, useEffect, useRef } from "react";
import { getCategoryFallbackImage } from "../../utils/categoryFallbacks";
import { isImageSafe, isImageCategoryCompatible } from "../../utils/imageSafety";

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  category?: string;
  subcategory?: string;
  productName?: string;
  fallbackText?: string;
  fit?: "contain" | "cover";
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  category,
  subcategory,
  productName,
  fallbackText,
  fit = "contain",
  loading = "lazy",
  ...props
}) => {
  const fallbackUrl = getCategoryFallbackImage(category, subcategory, productName || alt);

  // Initial safety and category-compatibility check on incoming src
  const isValidCandidate = (url: string) =>
    Boolean(url && isImageSafe(url) && isImageCategoryCompatible(url, category, subcategory));

  const initialSrc = isValidCandidate(src) ? src : fallbackUrl;
  const isDataUri = initialSrc.startsWith("data:");

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasFailed, setHasFailed] = useState<boolean>(!isValidCandidate(src));
  const [loaded, setLoaded] = useState<boolean>(isDataUri);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isValidCandidate(src)) {
      setCurrentSrc(fallbackUrl);
      setHasFailed(true);
      setLoaded(true);
    } else {
      setCurrentSrc(src);
      setHasFailed(false);
      // If already a data URI or cached complete image
      if (src.startsWith("data:")) {
        setLoaded(true);
      } else if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setLoaded(false);
      }
    }
  }, [src, category, subcategory, fallbackUrl]);

  // Check if image completed loading before React event listener attached
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (!hasFailed) {
      setHasFailed(true);
      setCurrentSrc(fallbackUrl);
      setLoaded(true);
    }
  };

  const objectFitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className={`relative overflow-hidden bg-slate-50 flex items-center justify-center ${className}`}>
      {!loaded && !hasFailed && (
        <div className="absolute inset-0 bg-slate-100/60 animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin opacity-40" />
        </div>
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${hasFailed ? "p-2" : ""}`}
        {...props}
      />
    </div>
  );
};
