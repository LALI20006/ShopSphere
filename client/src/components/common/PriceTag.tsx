import React from "react";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  discountPercent,
  size = "md",
  className = "",
}) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculatedDiscount =
    discountPercent ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  const priceSizes = {
    sm: "text-base font-bold text-slate-900",
    md: "text-lg font-bold text-slate-900",
    lg: "text-2xl font-extrabold text-slate-900",
    xl: "text-3xl font-extrabold text-slate-900",
  };

  const origSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={priceSizes[size]}>{formatINR(price)}</span>

      {originalPrice && originalPrice > price && (
        <span className={`line-through text-slate-400 font-medium ${origSizes[size]}`}>
          {formatINR(originalPrice)}
        </span>
      )}

      {calculatedDiscount > 0 && (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          {calculatedDiscount}% OFF
        </span>
      )}
    </div>
  );
};
