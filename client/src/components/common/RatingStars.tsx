import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount,
  size = "sm",
  showCount = true,
}) => {
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-semibold",
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = rating >= star;
          const isHalf = !isFull && rating >= star - 0.5;

          return (
            <span key={star} className="relative inline-block">
              {isHalf ? (
                <span className="relative inline-block">
                  <Star className={`${iconSizes[size]} text-slate-200 fill-slate-200`} />
                  <span className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={`${iconSizes[size]} text-amber-500 fill-amber-500`} />
                  </span>
                </span>
              ) : (
                <Star
                  className={`${iconSizes[size]} ${
                    isFull
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              )}
            </span>
          );
        })}
      </div>

      <span className={`font-semibold text-slate-700 ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>

      {showCount && reviewsCount !== undefined && (
        <span className="text-xs text-slate-500">
          ({reviewsCount.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
};
