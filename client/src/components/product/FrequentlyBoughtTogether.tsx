import React, { useState } from "react";
import { Plus, Check, ShoppingCart } from "lucide-react";
import { Product } from "../../types";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { useCartStore } from "../../store/cartStore";

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  companionProduct: Product;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  companionProduct,
}) => {
  const addItem = useCartStore((s) => s.addItem);
  const [includeCompanion, setIncludeCompanion] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const bundleTotal = mainProduct.price + (includeCompanion ? companionProduct.price : 0);
  const originalBundleTotal =
    mainProduct.originalPrice + (includeCompanion ? companionProduct.originalPrice : 0);
  const savings = originalBundleTotal - bundleTotal;

  const handleAddBundle = () => {
    addItem(mainProduct, 1);
    if (includeCompanion) {
      addItem(companionProduct, 1);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-subtle my-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span>Frequently Bought Together</span>
        <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
          Save {formatINR(savings)}
        </span>
      </h3>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Images with plus sign */}
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 rounded-xl bg-white border border-slate-200 p-2 overflow-hidden shadow-sm shrink-0">
            <ImageWithFallback
              src={mainProduct.images[0]}
              alt={mainProduct.name}
              className="w-full h-full object-contain"
              fallbackText={mainProduct.name}
            />
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
            <Plus className="w-4 h-4" />
          </div>

          <div
            className={`w-24 h-24 rounded-xl bg-white border p-2 overflow-hidden shadow-sm shrink-0 transition-opacity ${
              includeCompanion ? "border-slate-200 opacity-100" : "border-dashed border-slate-300 opacity-40"
            }`}
          >
            <ImageWithFallback
              src={companionProduct.images[0]}
              alt={companionProduct.name}
              className="w-full h-full object-contain"
              fallbackText={companionProduct.name}
            />
          </div>
        </div>

        {/* Checkboxes for selection */}
        <div className="flex-1 space-y-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
            <input
              type="checkbox"
              checked={true}
              disabled={true}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-not-allowed"
            />
            <span className="line-clamp-1">
              <b>This item:</b> {mainProduct.name} (<b>{formatINR(mainProduct.price)}</b>)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
            <input
              type="checkbox"
              checked={includeCompanion}
              onChange={(e) => setIncludeCompanion(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span className="line-clamp-1">
              {companionProduct.name} (<b>{formatINR(companionProduct.price)}</b>)
            </span>
          </label>
        </div>

        {/* Price & Action Button */}
        <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
          <div className="text-right">
            <div className="text-xs text-slate-500">Total Bundle Price:</div>
            <div className="text-xl font-extrabold text-slate-900">{formatINR(bundleTotal)}</div>
          </div>

          <button
            onClick={handleAddBundle}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Bundle Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add Both to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
