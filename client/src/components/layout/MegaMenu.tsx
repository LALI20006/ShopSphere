import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Tv,
  Refrigerator,
  Shirt,
  ShoppingBag,
  Home,
  Sparkles,
  Dumbbell,
  Baby,
  Car,
  BookOpen,
  Gamepad2,
  Laptop,
  Headphones,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Flame,
  X,
} from "lucide-react";
import { Category } from "../../types";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-4 h-4 text-indigo-500" />,
  Tv: <Tv className="w-4 h-4 text-cyan-500" />,
  Laptop: <Laptop className="w-4 h-4 text-blue-500" />,
  Refrigerator: <Refrigerator className="w-4 h-4 text-blue-500" />,
  Shirt: <Shirt className="w-4 h-4 text-amber-500" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4 text-rose-500" />,
  Home: <Home className="w-4 h-4 text-emerald-500" />,
  Sparkles: <Sparkles className="w-4 h-4 text-pink-500" />,
  Dumbbell: <Dumbbell className="w-4 h-4 text-orange-500" />,
  Baby: <Baby className="w-4 h-4 text-yellow-500" />,
  Car: <Car className="w-4 h-4 text-red-500" />,
  BookOpen: <BookOpen className="w-4 h-4 text-violet-500" />,
  Headphones: <Headphones className="w-4 h-4 text-purple-500" />,
  Gamepad2: <Gamepad2 className="w-4 h-4 text-purple-500" />,
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, categories }) => {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    categories[0]?.slug || "electronics"
  );
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug) || categories[0];

  const toggleMobileCategory = (slug: string) => {
    setExpandedMobileCategory(expandedMobileCategory === slug ? null : slug);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 top-[102px] bg-slate-900/60 backdrop-blur-xs z-30 transition-opacity"
      />

      {/* Mega Menu Container */}
      <div className="absolute top-[102px] left-0 right-0 bg-white shadow-2xl border-b border-slate-200 z-30 animate-fade-in max-h-[calc(100vh-120px)] overflow-hidden">
        {/* DESKTOP VIEW (md and up): Two-column interactive panel */}
        <div className="hidden md:flex max-w-7xl mx-auto h-[530px]">
          {/* Left Column: Categories List */}
          <div className="w-72 bg-slate-50/90 border-r border-slate-200 overflow-y-auto py-3">
            <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shop by Category ({categories.length})
            </div>
            <div className="space-y-0.5 px-2">
              {categories.map((cat) => {
                const isActive = cat.slug === activeCategorySlug;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategorySlug(cat.slug)}
                    onClick={() => setActiveCategorySlug(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`shrink-0 ${isActive ? "text-white" : ""}`}>
                        {iconMap[cat.icon] || <ShoppingBag className="w-4 h-4" />}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? "text-white translate-x-0.5" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Subcategories & Banner Preview */}
          {activeCategory && (
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Header of selected category */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{activeCategory.name}</span>
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                        {activeCategory.subcategories.length} Subcategories
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeCategory.description}
                    </p>
                  </div>
                  <Link
                    to={`/category/${activeCategory.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    <span>View Category Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 max-h-[310px] overflow-y-auto pr-2">
                  {activeCategory.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/category/${activeCategory.slug}/${sub.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50/70 transition-colors text-xs text-slate-700 hover:text-indigo-600 font-medium border border-transparent hover:border-indigo-100"
                    >
                      <span className="truncate group-hover:translate-x-1 transition-transform">
                        {sub.name}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Featured Promo Banner */}
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 flex items-center justify-between relative overflow-hidden shadow-md">
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-0.5">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>Exclusive Deals in {activeCategory.name}</span>
                  </div>
                  <h4 className="text-sm font-extrabold">Save Up to 60% on Bestsellers Today</h4>
                  <p className="text-[11px] text-slate-300">
                    Fast delivery, 100% authentic products & easy returns.
                  </p>
                </div>
                <Link
                  to={`/category/${activeCategory.slug}`}
                  onClick={onClose}
                  className="relative z-10 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE VIEW (< md): Touch-Friendly Expandable Accordion Menu */}
        <div className="md:hidden max-h-[75vh] overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Explore Categories</h3>
              <p className="text-[11px] text-slate-400">Tap a category to view subcategories</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {categories.map((cat) => {
              const isExpanded = expandedMobileCategory === cat.slug;
              return (
                <div
                  key={cat.id}
                  className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => toggleMobileCategory(cat.slug)}
                    className={`w-full flex items-center justify-between p-3 text-left text-xs font-bold transition-colors ${
                      isExpanded ? "bg-indigo-600 text-white" : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isExpanded ? "text-white" : ""}>
                        {iconMap[cat.icon] || <ShoppingBag className="w-4 h-4" />}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          isExpanded ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {cat.subcategories.length}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-white" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-white border-t border-slate-100 space-y-1 animate-fade-in">
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors mb-2"
                      >
                        <span>All {cat.name} Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="grid grid-cols-1 gap-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${cat.slug}/${sub.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 hover:text-indigo-600 font-medium transition-colors"
                          >
                            <span>{sub.name}</span>
                            <ChevronRight className="w-3 h-3 text-slate-300" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
