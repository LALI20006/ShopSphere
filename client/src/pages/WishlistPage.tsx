import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight, Check, AlertCircle, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { PriceTag } from "../components/common/PriceTag";
import { RatingStars } from "../components/common/RatingStars";

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { items, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [movedItems, setMovedItems] = useState<{ [id: string]: boolean }>({});

  const handleMoveToCart = (product: any) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/wishlist")}&reason=cart`);
      return;
    }
    addItemToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
    removeItem(product.id);
    setMovedItems((prev) => ({ ...prev, [product.id]: true }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50">
        <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6 text-rose-500 shadow-inner">
          <Heart className="w-12 h-12 fill-rose-500/20" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-slate-500 max-w-md text-center mb-8 text-sm sm:text-base">
          Save your favorite products here so you never lose track of them. Explore our top categories and find something special!
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          Discover Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>My Wishlist</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Items saved in your wishlist remain here until purchased or deleted.
            </p>
          </div>
          <Link
            to="/cart"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 text-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            View Cart
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Product Thumbnail */}
                <Link
                  to={`/product/${product.slug}`}
                  className="block aspect-square w-full bg-slate-50 p-6 relative overflow-hidden"
                >
                  <ImageWithFallback
                    src={product.thumbnail || product.images[0]}
                    alt={product.name}
                    category={product.category}
                    subcategory={product.subcategory}
                    productName={product.name}
                    fit="contain"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPercent > 0 && (
                    <span className="absolute bottom-3 left-3 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </Link>

                {/* Info Container */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {product.brand}
                    </div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-2 transition-colors mb-2"
                    >
                      {product.name}
                    </Link>

                    <div className="mb-2">
                      <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
                    </div>

                    <PriceTag
                      price={product.price}
                      originalPrice={product.originalPrice}
                      discountPercent={product.discountPercent}
                      size="md"
                    />

                    <div className="mt-2 text-xs">
                      {isOutOfStock ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Out of stock
                        </span>
                      ) : product.stock <= 4 ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Only {product.stock} left
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      disabled={isOutOfStock}
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
