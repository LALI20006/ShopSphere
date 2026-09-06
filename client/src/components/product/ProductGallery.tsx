import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const activeImage = images[selectedIndex] || images[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails list */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] p-1 no-scrollbar">
        {images.map((img, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                isSelected
                  ? "border-indigo-600 ring-2 ring-indigo-200"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
            >
              <ImageWithFallback
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                fallbackText={productName}
              />
            </button>
          );
        })}
      </div>

      {/* Main Image View */}
      <div className="flex-1 relative bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden group">
        {/* Main interactive zoom container */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setIsZoomOpen(true)}
          className="w-full aspect-square relative cursor-crosshair flex items-center justify-center overflow-hidden"
        >
          <ImageWithFallback
            src={activeImage}
            alt={productName}
            className={`w-full h-full object-contain p-4 transition-transform duration-200 ${
              isHovering ? "scale-125" : "scale-100"
            }`}
            style={
              isHovering
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
            fallbackText={productName}
          />
        </div>

        {/* Previous / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom trigger icon */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white shadow-sm text-slate-600 hover:text-indigo-600 transition-all"
          title="Open Fullscreen Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Modal View */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 text-slate-300 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] relative flex items-center justify-center">
            <img
              src={activeImage}
              alt={productName}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
