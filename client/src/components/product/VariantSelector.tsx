import React from "react";
import { Check } from "lucide-react";

interface VariantSelectorProps {
  colors?: string[];
  sizes?: string[];
  selectedColor?: string;
  selectedSize?: string;
  onSelectColor?: (color: string) => void;
  onSelectSize?: (size: string) => void;
  quantity: number;
  maxStock: number;
  onQuantityChange: (qty: number) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
  quantity,
  maxStock,
  onQuantityChange,
}) => {
  return (
    <div className="space-y-4 py-4 border-y border-slate-100">
      {/* Colors */}
      {colors && colors.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Color: <span className="text-slate-900 font-semibold">{selectedColor || colors[0]}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = (selectedColor || colors[0]) === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onSelectColor && onSelectColor(color)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes && sizes.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Size: <span className="text-slate-900 font-semibold">{selectedSize || sizes[0]}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = (selectedSize || sizes[0]) === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize && onSelectSize(size)}
                  className={`min-w-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  <span>{size}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity counter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(quantity - 1)}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-sm text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= maxStock}
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            >
              +
            </button>
          </div>

          <span className="text-xs text-slate-500">
            {maxStock > 0 ? (
              maxStock <= 5 ? (
                <span className="text-amber-600 font-bold">Only {maxStock} left in stock!</span>
              ) : (
                <span className="text-emerald-600 font-medium">In Stock</span>
              )
            ) : (
              <span className="text-rose-500 font-bold">Out of stock</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
