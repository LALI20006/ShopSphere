import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Check, Zap } from "lucide-react";
import { Product } from "../../types";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { RatingStars } from "../common/RatingStars";
import { PriceTag } from "../common/PriceTag";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
}) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const user = useAuthStore((s) => s.user);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (!user) {
      try {
        sessionStorage.setItem(
          "shopsphere_pending_cart_item",
          JSON.stringify({
            product,
            quantity: 1,
            selectedColor: product.colors?.[0],
            selectedSize: product.sizes?.[0],
          })
        );
      } catch (err) {}
      navigate(
        `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}&reason=cart`
      );
      return;
    }

    addItem(product, 1, product.colors?.[0], product.sizes?.[0]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product, Boolean(user));
  };

  // --- List View Mode ---
  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-subtle hover:shadow-hover transition-all duration-300 p-4 flex flex-col sm:flex-row gap-4 relative overflow-hidden">
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
            inWishlist
              ? "bg-rose-50 text-rose-600"
              : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white"
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Image Thumbnail */}
        <Link
          to={`/product/${product.slug}`}
          className="w-full sm:w-48 h-48 sm:h-44 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative block"
        >
          <ImageWithFallback
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fallbackText={product.name}
          />
          {product.dealBadge && (
            <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow">
              {product.dealBadge}
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 capitalize">{product.subcategory.replace(/-/g, " ")}</span>
            </div>

            <Link
              to={`/product/${product.slug}`}
              className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>

            <div className="mt-2">
              <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
            </div>

            <p className="text-xs text-slate-500 mt-2 line-clamp-2">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <div>
              <PriceTag
                price={product.price}
                originalPrice={product.originalPrice}
                discountPercent={product.discountPercent}
                size="md"
              />
              <div className="flex items-center gap-2 text-[11px] mt-1">
                {product.freeDelivery ? (
                  <span className="font-semibold text-emerald-700">FREE Delivery</span>
                ) : (
                  <span className="text-slate-500">Standard Delivery</span>
                )}
                {isLowStock && (
                  <span className="text-amber-600 font-bold">Only {product.stock} left</span>
                )}
                {isOutOfStock && (
                  <span className="text-rose-600 font-bold">Out of stock</span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Grid View Mode (Default) ---
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-subtle hover:shadow-hover transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between relative overflow-hidden">
      {/* Top badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div>
          {product.dealBadge ? (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow pointer-events-auto">
              {product.dealBadge}
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow pointer-events-auto">
              Best Seller
            </span>
          ) : product.discountPercent >= 30 ? (
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow pointer-events-auto">
              {product.discountPercent}% OFF
            </span>
          ) : null}
        </div>

        <button
          onClick={handleToggleWishlist}
          className={`p-2 rounded-full shadow-sm backdrop-blur-md transition-transform active:scale-90 pointer-events-auto ${
            inWishlist
              ? "bg-rose-50 text-rose-600"
              : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Product Image Gallery Preview */}
      <Link
        to={`/product/${product.slug}`}
        className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 relative block mb-3"
      >
        <ImageWithFallback
          src={product.images[activeImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackText={product.name}
        />

        {/* Thumbnail switcher indicators if product has 2+ images */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.images.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeImageIndex === idx
                    ? "bg-indigo-600 w-4"
                    : "bg-white/80 hover:bg-white shadow"
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            {product.brand}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-500 truncate capitalize">
            {product.subcategory.replace(/-/g, " ")}
          </span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-2.5">
          <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-2">
          <PriceTag
            price={product.price}
            originalPrice={product.originalPrice}
            discountPercent={product.discountPercent}
            size="sm"
          />

          <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
            <span>{product.freeDelivery ? "FREE Delivery" : "₹49 Delivery"}</span>
            {isLowStock && (
              <span className="text-amber-600 font-bold">Only {product.stock} left</span>
            )}
            {isOutOfStock && (
              <span className="text-rose-600 font-bold">Out of stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart CTA Button */}
      <div className="mt-3 pt-2 border-t border-slate-100">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
            isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : isAdded
              ? "bg-emerald-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
