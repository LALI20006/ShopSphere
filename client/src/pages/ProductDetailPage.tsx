import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingCart,
  Zap,
  MapPin,
  Check,
  Share2,
  Tag,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { Product } from "../types";
import { productApi } from "../services/api";
import { ProductGallery } from "../components/product/ProductGallery";
import { VariantSelector } from "../components/product/VariantSelector";
import { RatingStars } from "../components/common/RatingStars";
import { PriceTag } from "../components/common/PriceTag";
import { FrequentlyBoughtTogether } from "../components/product/FrequentlyBoughtTogether";
import { ReviewSection } from "../components/product/ReviewSection";
import { ProductCard } from "../components/product/ProductCard";
import { ProductDetailSkeleton } from "../components/common/LoadingSkeleton";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useLocationStore } from "../store/locationStore";
import { useAuthStore } from "../store/authStore";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { city, pincode, openModal: openLocationModal } = useLocationStore();
  const user = useAuthStore((s) => s.user);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Variant States
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Pincode checker inside buy box
  const [checkPincode, setCheckPincode] = useState(pincode);
  const [checkedDeliveryDate, setCheckedDeliveryDate] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await productApi.getProductByIdOrSlug(slug);
        const p = res.product;
        setProduct(p);

        if (p.colors && p.colors.length > 0) {
          setSelectedColor(p.colors[0]);
        }
        if (p.sizes && p.sizes.length > 0) {
          setSelectedSize(p.sizes[0]);
        }
        setQuantity(1);

        // Fetch related products for this item
        const relRes = await productApi.getRelated(p.id, 6);
        setRelatedProducts(relRes.related || []);

        // Track in Recently Viewed in localStorage
        try {
          const viewedRaw = localStorage.getItem("shopsphere_recently_viewed");
          let viewed: Product[] = viewedRaw ? JSON.parse(viewedRaw) : [];
          viewed = [p, ...viewed.filter((item) => item.id !== p.id)].slice(0, 8);
          localStorage.setItem("shopsphere_recently_viewed", JSON.stringify(viewed));
        } catch {
          // ignore
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The item you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
        >
          Return to ShopSphere Home
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!user) {
      try {
        sessionStorage.setItem(
          "shopsphere_pending_cart_item",
          JSON.stringify({
            product,
            quantity,
            selectedColor,
            selectedSize,
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
    addItem(product, quantity, selectedColor, selectedSize);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!user) {
      try {
        sessionStorage.setItem(
          "shopsphere_pending_cart_item",
          JSON.stringify({
            product,
            quantity,
            selectedColor,
            selectedSize,
          })
        );
      } catch (err) {}
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}&reason=cart`);
      return;
    }
    addItem(product, quantity, selectedColor, selectedSize);
    navigate("/checkout");
  };

  const handleDeliveryCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(checkPincode)) {
      const days = product.deliveryDays || 2;
      const targetDate = new Date(Date.now() + days * 86400000);
      setCheckedDeliveryDate(
        targetDate.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
      );
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap no-scrollbar">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <Link
          to={`/category/${product.category}`}
          className="hover:text-indigo-600 transition-colors capitalize"
        >
          {product.category.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <Link
          to={`/category/${product.category}/${product.subcategory}`}
          className="hover:text-indigo-600 transition-colors capitalize"
        >
          {product.subcategory.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="font-bold text-slate-900 truncate max-w-sm">{product.name}</span>
      </nav>

      {/* 3-Column Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Interactive Image Gallery (Span 5) */}
        <div className="lg:col-span-5">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Center Column: Product Details & Variant Selection (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Brand: {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">SKU: {product.sku}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews link */}
            <div className="flex items-center gap-3 mt-2.5">
              <RatingStars
                rating={product.rating}
                reviewsCount={product.reviewsCount}
                size="md"
              />
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Verified Authentic
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercent={product.discountPercent}
              size="lg"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Inclusive of all taxes • EMI starts at {formatINR(Math.round(product.price / 12))}/month
            </p>
          </div>

          {/* Special Offers & Bank Discounts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Available Offers & Coupons:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                <p className="font-bold text-amber-900">10% Instant Off</p>
                <p className="text-[11px] text-amber-700">Use code WELCOME10 at checkout.</p>
              </div>
              <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                <p className="font-bold text-indigo-900">₹500 Flat Savings</p>
                <p className="text-[11px] text-indigo-700">Use code SAVE500 on orders &gt; ₹2499.</p>
              </div>
            </div>
          </div>

          {/* Variants: Colors, Sizes, Quantity */}
          <VariantSelector
            colors={product.colors}
            sizes={product.sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
            quantity={quantity}
            maxStock={product.stock}
            onQuantityChange={setQuantity}
          />

          {/* Key Product Features / Highlights */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Product Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Buy Box / Fulfillment Action Card (Span 3) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-card sticky top-28 space-y-4">
            {/* Total Price */}
            <div>
              <span className="text-xs text-slate-500 block">Total Price:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {formatINR(product.price * quantity)}
              </span>
            </div>

            {/* Delivery Location Estimation */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Deliver to {city} {pincode}</span>
              </div>
              <button
                onClick={openLocationModal}
                className="text-[11px] text-indigo-600 hover:underline font-bold"
              >
                Change delivery location
              </button>

              {/* Quick pincode delivery check form */}
              <form onSubmit={handleDeliveryCheck} className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  maxLength={6}
                  value={checkPincode}
                  onChange={(e) => setCheckPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter pincode"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"
                >
                  Check
                </button>
              </form>

              {checkedDeliveryDate && (
                <p className="text-[11px] font-semibold text-emerald-700 mt-2">
                  ✓ Estimated Delivery by <b>{checkedDeliveryDate}</b>
                </p>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="pt-2 border-t border-slate-100 text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">Currently Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-bold">Only {product.stock} left in stock - Order soon!</span>
              ) : (
                <span className="text-emerald-700 font-bold">In Stock. Ready to Ship.</span>
              )}
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sold by <span className="font-semibold text-slate-700">{product.seller}</span>
              </p>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : addedFeedback
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98"
                }`}
              >
                {addedFeedback ? (
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

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => toggleWishlist(product, Boolean(user))}
              className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                inWishlist
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{inWishlist ? "Saved in Wishlist" : "Add to Wishlist"}</span>
            </button>

            {/* Assurance Trust Badges */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secure Transaction & Simulated Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>7-Day Return & Replacement Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Doorstep Delivery across {city} and India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle my-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>Technical Specifications</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-slate-100"
              >
                <span className="font-semibold text-slate-500">{key}</span>
                <span className="font-bold text-slate-900 text-right">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Description */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle my-8">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Product Description</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          {product.description}
        </p>
      </div>

      {/* Frequently Bought Together Bundle Widget */}
      {relatedProducts.length > 0 && (
        <FrequentlyBoughtTogether
          mainProduct={product}
          companionProduct={relatedProducts[0]}
        />
      )}

      {/* Customer Reviews & Breakdown Section */}
      <ReviewSection product={product} />

      {/* Similar / Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="my-12">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-slate-900">
              Customers Also Viewed
            </h3>
            <Link
              to={`/category/${product.category}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              See All in Category
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
