import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Bookmark,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { PriceTag } from "../components/common/PriceTag";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items,
    savedForLater,
    appliedCoupon,
    couponError,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getOriginalTotal,
    getDiscount,
    getDeliveryFee,
    getCouponDiscount,
    getGrandTotal,
    getItemCount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const originalTotal = getOriginalTotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const couponDiscount = getCouponDiscount();
  const grandTotal = getGrandTotal();
  const itemCount = getItemCount();

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput.trim();
    if (!code) return;
    setIsApplyingCoupon(true);
    await applyCoupon(code);
    setIsApplyingCoupon(false);
    setCouponInput("");
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50">
        <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-6 text-indigo-500 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500 max-w-md text-center mb-8 text-sm sm:text-base">
          Looks like you haven't added anything to your cart yet. Explore thousands of deals and top trending products!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/deals"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            Explore Today's Deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart{" "}
            <span className="text-base font-normal text-slate-500">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h1>
          <Link
            to="/"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hidden sm:inline-flex items-center gap-1"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Truck className="w-4 h-4 text-indigo-600" />
              {amountNeededForFreeDelivery === 0 ? (
                <span className="text-emerald-700 font-bold">
                  🎉 You've unlocked FREE Standard Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-indigo-700 font-bold">₹{amountNeededForFreeDelivery.toLocaleString("en-IN")}</strong> more to qualify for <strong>FREE Delivery</strong>
                </span>
              )}
            </span>
            <span className="text-slate-400 font-semibold">{Math.round(freeDeliveryProgress)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                amountNeededForFreeDelivery === 0
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-indigo-500 to-amber-500"
              }`}
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-slate-600">Your active cart is empty. Check your saved items below!</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 relative transition-all hover:border-slate-300"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-full sm:w-32 h-32 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center"
                  >
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="text-base font-bold text-slate-800 hover:text-indigo-600 line-clamp-2 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <PriceTag
                          price={item.product.price * item.quantity}
                          originalPrice={item.product.originalPrice * item.quantity}
                          discountPercent={item.product.discountPercent}
                          size="md"
                          className="text-right flex-shrink-0"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{item.product.brand}</span>
                        <span>•</span>
                        <span>{item.product.category}</span>
                        {item.selectedColor && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                              Color: {item.selectedColor}
                            </span>
                          </>
                        )}
                        {item.selectedSize && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                              Size: {item.selectedSize}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock status */}
                      <div className="mt-2 text-xs">
                        {item.product.stock <= 4 ? (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Only {item.product.stock} left in stock - order soon
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> In Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions bar: Quantity + Save + Delete */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-2 text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.quantity >= item.product.stock}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-2 text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <button
                          onClick={() =>
                            saveForLater(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          Save for later
                        </button>
                        <button
                          onClick={() =>
                            removeItem(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Saved for Later Section */}
            {savedForLater.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-600" />
                  Saved For Later ({savedForLater.length})
                </h3>
                <div className="space-y-3">
                  {savedForLater.map((item) => (
                    <div
                      key={`saved-${item.productId}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                      className="bg-white/80 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-4 justify-between"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div>
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="text-sm font-semibold text-slate-800 hover:text-indigo-600 line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">
                            ₹{item.product.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                          onClick={() =>
                            moveToCart(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 text-xs transition-colors"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() =>
                            removeSavedItem(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Coupon Code section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  Have a Promo Code?
                </label>
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-xs text-emerald-700 font-medium mt-1">
                        Saved ₹{appliedCoupon.discountAmount.toLocaleString("en-IN")} ({appliedCoupon.description})
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 uppercase font-mono text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {couponError}
                      </p>
                    )}

                    {/* Quick coupon suggestions */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="text-[11px] text-slate-500 mr-1 self-center">Try:</span>
                      {["WELCOME10", "SHOP20", "SAVE500"].map((c) => (
                        <button
                          key={c}
                          onClick={() => handleApplyCoupon(c)}
                          className="text-[10px] font-mono font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm pt-3 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Price ({itemCount} items)</span>
                  <span>₹{originalTotal.toLocaleString("en-IN")}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Savings</span>
                    <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-base">Total Amount</span>
                  <span className="text-2xl text-slate-900 font-black">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {discount + couponDiscount > 0 && (
                  <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg text-center">
                    You are saving ₹{(discount + couponDiscount).toLocaleString("en-IN")} on this order!
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={items.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Indicators */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>256-bit Secure Pay</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
