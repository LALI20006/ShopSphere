import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Product, Category } from "../types";
import { productApi } from "../services/api";
import { ProductCard } from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/common/LoadingSkeleton";

interface HomePageProps {
  categories: Category[];
}

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Mega Tech Fest 2026",
    title: "Next-Gen Flagship Smartphones & Ultrabooks",
    subtitle: "Experience revolutionary AI performance with up to 40% Off on top brands.",
    ctaText: "Shop Mobiles",
    ctaLink: "/category/mobiles",
    bgGradient: "from-slate-950 via-indigo-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    accentColor: "text-amber-400",
  },
  {
    id: 2,
    badge: "Spring Fashion Carnival",
    title: "Curated Designer Kurtas, Denims & Chronographs",
    subtitle: "Elevate your daily style with verified luxury labels and festive arrivals.",
    ctaText: "Explore Fashion",
    ctaLink: "/category/fashion",
    bgGradient: "from-slate-950 via-purple-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    accentColor: "text-rose-400",
  },
  {
    id: 3,
    badge: "Smart Home Upgrade",
    title: "Energy-Smart Inverter ACs, OLED TVs & Cookware",
    subtitle: "Transform your living space with intelligent, energy-saving home appliances.",
    ctaText: "Upgrade Home",
    ctaLink: "/category/home-kitchen",
    bgGradient: "from-slate-950 via-blue-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80",
    accentColor: "text-cyan-400",
  },
];

export const HomePage: React.FC<HomePageProps> = ({ categories }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deals, setDeals] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [electronics, setElectronics] = useState<Product[]>([]);
  const [fashion, setFashion] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Live countdown timer for Today's Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide autoplay
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [dealsRes, featRes, elecRes, fashRes] = await Promise.all([
          productApi.getDeals(8),
          productApi.getFeatured(8),
          productApi.getProducts({ category: "mobiles", limit: 4 }),
          productApi.getProducts({ category: "fashion", limit: 4 }),
        ]);

        setDeals(dealsRes.deals || []);
        setFeatured(featRes.featured || []);
        setElectronics(elecRes.products || []);
        setFashion(fashRes.products || []);
      } catch (err) {
        console.error("Failed to load home page data", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Hero Banner Slider */}
      <div className="relative bg-slate-950 overflow-hidden text-white min-h-[420px] sm:min-h-[480px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-30 transition-all duration-1000 transform scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90`} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            <div className="pt-3 flex items-center gap-4">
              <Link
                to={slide.ctaLink}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/deals"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/20 transition-colors"
              >
                Explore Today's Deals
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "bg-amber-400 w-8" : "bg-white/40 w-2"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Shop by Category Circles / Cards */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Explore thousands of products across our 11 curated marketplace departments
            </p>
          </div>
          <Link
            to="/category/electronics"
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group p-3 bg-white border border-slate-200/80 hover:border-indigo-400 rounded-2xl shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 mb-2.5 relative group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.bannerImage}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-indigo-950/10 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 line-clamp-2 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.subcategories.length} subcategories
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Today's Deals Section with Live Countdown Timer */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30">
                <Flame className="w-7 h-7 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Today's Lightning Deals
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-500">Unbeatable limited-time discounts</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Deals end in:</span>
              <div className="flex items-center gap-1 font-mono text-slate-900">
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                <span>:</span>
                <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
              : deals.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/deals"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              <span>View All 50+ Live Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Best Sellers Showcase */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Top Rated & Best Sellers
              </h2>
              <p className="text-xs text-slate-500">Most purchased items with 4.5+ star verified ratings</p>
            </div>
          </div>
          <Link
            to="/category/laptops"
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
            : featured.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>

      {/* 5. Electronics & Gadgets Banner Showcase */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Flagship Mobiles & Gadgets
            </h2>
            <p className="text-xs text-slate-500">
              Galaxy S24 Ultra, iPhone 15 Pro, Pixel 8 Pro, OnePlus 12 & more
            </p>
          </div>
          <Link
            to="/category/mobiles"
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>Explore Mobiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
            : electronics.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>

      {/* 6. Men's & Women's Fashion Highlight */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Trending in Fashion & Footwear
            </h2>
            <p className="text-xs text-slate-500">
              Authentic Levi's denim, Adidas streetwear, luxury shirts & kurtas
            </p>
          </div>
          <Link
            to="/category/fashion"
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>Explore Fashion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
            : fashion.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>

      {/* 7. ShopSphere Customer Assurance Guarantee */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
              The ShopSphere Promise
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              A Safe, Modern & Transparent Marketplace
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every single product listed on ShopSphere undergoes strict quality assurance. We partner directly with authorized distributors to provide verified brand warranties, transparent pricing in INR, and doorstep customer returns.
            </p>
            <div className="pt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Verified Sellers Only
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                7-Day Easy Replacements
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                256-Bit Encrypted Payments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
