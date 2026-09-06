import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  ChevronRight,
  X,
  RotateCcw,
  PackageSearch,
  Star,
} from "lucide-react";
import { Product, Category } from "../types";
import { productApi } from "../services/api";
import { ProductCard } from "../components/product/ProductCard";
import { CatalogSkeleton } from "../components/common/LoadingSkeleton";

interface CatalogPageProps {
  categories: Category[];
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ categories }) => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug?: string;
    subcategorySlug?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const initialCategory = categorySlug || searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "best-selling" | "discount"
  >("featured");

  // Find active category & subcategory objects
  const activeCategory = categories.find((c) => c.slug === (categorySlug || initialCategory));
  const activeSubcategory = activeCategory?.subcategories.find((s) => s.slug === subcategorySlug);

  // Available brands in the current results
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    // Reset page on route change
    setCurrentPage(1);
  }, [categorySlug, subcategorySlug, searchQuery]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams: any = {
          category: categorySlug || (initialCategory !== "all" ? initialCategory : undefined),
          subcategory: subcategorySlug,
          search: searchQuery || undefined,
          sort: sortBy,
          page: currentPage,
          limit: 24,
          inStock: inStockOnly ? true : undefined,
          hasDiscount: hasDiscountOnly ? true : undefined,
          rating: minRating,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
        };

        const res = await productApi.getProducts(queryParams);
        setProducts(res.products || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || 1);

        // Extract brands
        if (res.products) {
          const brands = Array.from(new Set(res.products.map((p) => p.brand))).filter(Boolean);
          setAvailableBrands((prev) => Array.from(new Set([...prev, ...brands])));
        }
      } catch (err) {
        console.error("Failed to load catalog products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [
    categorySlug,
    subcategorySlug,
    searchQuery,
    initialCategory,
    sortBy,
    currentPage,
    inStockOnly,
    hasDiscountOnly,
    minRating,
    minPrice,
    maxPrice,
    selectedBrands,
  ]);

  const handleBrandToggle = (brand: string) => {
    setCurrentPage(1);
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(undefined);
    setInStockOnly(false);
    setHasDiscountOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    minRating !== undefined ||
    inStockOnly ||
    hasDiscountOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 overflow-x-auto whitespace-nowrap no-scrollbar">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />

        {activeCategory ? (
          <>
            <Link
              to={`/category/${activeCategory.slug}`}
              className={`hover:text-indigo-600 transition-colors ${
                !activeSubcategory ? "font-bold text-slate-900" : ""
              }`}
            >
              {activeCategory.name}
            </Link>

            {activeSubcategory && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900">{activeSubcategory.name}</span>
              </>
            )}
          </>
        ) : searchQuery ? (
          <span className="font-bold text-slate-900">Search results for "{searchQuery}"</span>
        ) : (
          <span className="font-bold text-slate-900">All Products</span>
        )}
      </nav>

      {/* Category Landing Banner (if on main category) */}
      {activeCategory && !activeSubcategory && !searchQuery && (
        <div className="mb-8 rounded-3xl bg-slate-900 text-white overflow-hidden relative shadow-lg min-h-[160px] flex items-center p-6 sm:p-8">
          <img
            src={activeCategory.bannerImage}
            alt={activeCategory.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {activeCategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {activeCategory.description}
            </p>

            {/* Subcategory Pills */}
            <div className="flex flex-wrap gap-2">
              {activeCategory.subcategories.slice(0, 8).map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${activeCategory.slug}/${sub.slug}`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-semibold transition-colors border border-white/10"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls Header Bar: Title, Count, Sort, View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {activeSubcategory
              ? activeSubcategory.name
              : activeCategory
              ? activeCategory.name
              : searchQuery
              ? `Search: "${searchQuery}"`
              : "All Products"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <b className="text-slate-900">{products.length}</b> of{" "}
            <b className="text-slate-900">{totalCount}</b> results
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && "•"}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-xl text-xs font-semibold px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="best-selling">Best Selling</option>
              <option value="newest">Newest Arrivals</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 select-none">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Price (₹)
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setMinPrice("0");
                    setMaxPrice("1000");
                  }}
                  className="block text-slate-600 hover:text-indigo-600"
                >
                  Under ₹1,000
                </button>
                <button
                  onClick={() => {
                    setMinPrice("1000");
                    setMaxPrice("5000");
                  }}
                  className="block text-slate-600 hover:text-indigo-600"
                >
                  ₹1,000 - ₹5,000
                </button>
                <button
                  onClick={() => {
                    setMinPrice("5000");
                    setMaxPrice("20000");
                  }}
                  className="block text-slate-600 hover:text-indigo-600"
                >
                  ₹5,000 - ₹20,000
                </button>
                <button
                  onClick={() => {
                    setMinPrice("20000");
                    setMaxPrice("");
                  }}
                  className="block text-slate-600 hover:text-indigo-600"
                >
                  Over ₹20,000
                </button>
              </div>
            </div>

            {/* Brand Checkboxes */}
            {availableBrands.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Brands
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Rating */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Customer Rating
              </h4>
              <div className="space-y-1.5 text-xs">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(minRating === stars ? undefined : stars)}
                    className={`flex items-center gap-1.5 p-1 rounded-lg w-full text-left transition-colors ${
                      minRating === stars ? "bg-indigo-50 text-indigo-900 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex text-amber-500">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                      {Array.from({ length: 5 - stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-slate-200 fill-slate-200" />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Deals Toggles */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Preferences
              </h4>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiscountOnly}
                    onChange={(e) => setHasDiscountOnly(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Discounted Deals Only</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-500 font-medium">Active filters:</span>
              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                >
                  {b}
                  <button onClick={() => handleBrandToggle(b)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {minPrice && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Min ₹{minPrice}
                  <button onClick={() => setMinPrice("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Max ₹{maxPrice}
                  <button onClick={() => setMaxPrice("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minRating && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {minRating}★ & Above
                  <button onClick={() => setMinRating(undefined)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-600 font-bold hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Catalog Listing */}
          {loading ? (
            <CatalogSkeleton count={8} />
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-subtle my-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No products found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Try adjusting your search terms, broadening your price range, or clearing active filters.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {(() => {
                const getPaginationItems = (current: number, total: number): (number | string)[] => {
                  if (total <= 7) {
                    return Array.from({ length: total }, (_, i) => i + 1);
                  }
                  if (current <= 4) {
                    return [1, 2, 3, 4, 5, "...", total];
                  }
                  if (current >= total - 3) {
                    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
                  }
                  return [1, "...", current - 1, current, current + 1, "...", total];
                };

                return getPaginationItems(currentPage, totalPages).map((item, idx) => {
                  if (item === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-9 h-9 flex items-center justify-center text-xs font-semibold text-slate-400"
                      >
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(item);
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-base text-slate-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="mb-5">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Brands</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="rounded text-indigo-600 w-3.5 h-3.5"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleClearAllFilters}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-xs text-slate-700"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
