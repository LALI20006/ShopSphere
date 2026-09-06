import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Clock, Sparkles, Filter, SlidersHorizontal, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { Product } from "../types";
import { productApi } from "../services/api";
import { ProductCard } from "../components/product/ProductCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "50plus" | "30to50" | "under999">("all");
  const [sortBy, setSortBy] = useState<"discount" | "price_asc" | "price_desc" | "rating">("discount");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dynamic countdown timer till midnight
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const res = await productApi.getDeals(40);
        setDeals(res.deals || []);
      } catch (err) {
        console.error("Failed to load deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Filter & Sort logic
  const categories = Array.from(new Set(deals.map((d) => d.category)));

  const filteredDeals = deals.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (filterTab === "50plus") return product.discountPercent >= 50;
    if (filterTab === "30to50") return product.discountPercent >= 30 && product.discountPercent < 50;
    if (filterTab === "under999") return product.price <= 999;
    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === "discount") return b.discountPercent - a.discountPercent;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Banner with Countdown */}
      <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white py-12 px-4 overflow-hidden border-b border-indigo-800/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Lightning Deals & Flash Offers
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Save Up To <span className="text-amber-400">70% Off</span> Today
              </h1>
              <p className="mt-2 text-slate-300 max-w-xl text-sm sm:text-base">
                Grab limited-time discounts on top electronics, premium fashion, home appliances, and daily essentials before timer runs out.
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col items-center shadow-2xl">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
                Deals Expire In
              </div>
              <div className="flex items-center gap-2 text-center">
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-white/10 min-w-[54px]">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-medium">Hours</span>
                </div>
                <span className="text-2xl font-black text-amber-400">:</span>
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-white/10 min-w-[54px]">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-medium">Mins</span>
                </div>
                <span className="text-2xl font-black text-amber-400">:</span>
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-white/10 min-w-[54px]">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-medium">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Sorting */}
      <div className="sticky top-16 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Deals ({deals.length})
            </button>
            <button
              onClick={() => setFilterTab("50plus")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === "50plus"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🔥 50%+ Off
            </button>
            <button
              onClick={() => setFilterTab("30to50")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === "30to50"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ⚡ 30% - 50% Off
            </button>
            <button
              onClick={() => setFilterTab("under999")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === "under999"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏷️ Under ₹999
            </button>
          </div>

          {/* Right Controls: Category filter & Sort */}
          <div className="flex items-center gap-3 ml-auto">
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hidden sm:inline font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="discount">Biggest Discount</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : sortedDeals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No deals found for this filter</h3>
            <p className="text-sm text-slate-500 mt-1">Try selecting another filter tab or category.</p>
            <button
              onClick={() => {
                setFilterTab("all");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Active Lightning Deals</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {sortedDeals.length} Offers
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedDeals.map((product) => (
                <div key={product.id} className="relative flex flex-col">
                  {/* Deal percentage flash sticker */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-md tracking-wider flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-white" />
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                  <ProductCard product={product} />
                  
                  {/* Simulated claim progress bar */}
                  <div className="bg-white px-3 pb-3 pt-0 rounded-b-2xl -mt-2 border-x border-b border-slate-100 shadow-sm text-xs">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                      <span>Claimed:</span>
                      <span className="font-semibold text-indigo-600">
                        {Math.min(92, Math.max(35, 100 - product.stock * 3))}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(92, Math.max(35, 100 - product.stock * 3))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
