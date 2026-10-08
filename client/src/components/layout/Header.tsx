import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
  ShieldCheck,
  LogOut,
  Flame,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { productApi } from "../../services/api";
import { Category } from "../../types";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onToggleMegaMenu: () => void;
  isMegaMenuOpen: boolean;
  categories: Category[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onToggleMegaMenu,
  isMegaMenuOpen,
  categories,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [suggestions, setSuggestions] = useState<{ name: string; brand: string; category: string; slug: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productApi.getSearchSuggestions(searchQuery);
        setSuggestions(res.suggestions || []);
      } catch (err) {
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!searchQuery.trim() && selectedCategory === "all") return;

    let url = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    if (selectedCategory !== "all") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    navigate(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Hamburger & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group select-none">
            {/* Original ShopSphere Logo Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center shadow-md shadow-indigo-950/40 group-hover:scale-105 transition-transform">
              <span className="w-4 h-4 rounded-full border-2 border-white/90" />
              <span className="absolute w-6 h-2 rounded-full border-t-2 border-white/80 rotate-45" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
                ShopSphere
              </span>
              <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-semibold">
                Marketplace
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar with Category Selector */}
        <div ref={searchRef} className="flex-1 max-w-2xl relative mx-1 sm:mx-2">
          <form onSubmit={handleSearchSubmit} className="flex w-full">
            {/* Category Dropdown prefix */}
            <div className="hidden sm:flex relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 rounded-l-xl border-r border-slate-300 focus:outline-none cursor-pointer hover:bg-slate-200 transition-colors appearance-none pr-7 max-w-[130px]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Input field */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products, brands, electronics, fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-10 bg-white text-slate-900 text-sm pl-3.5 pr-8 rounded-l-xl sm:rounded-l-none focus:outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="h-10 px-4 sm:px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-r-xl flex items-center justify-center transition-all shadow-sm"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-11 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-slate-800 animate-fade-in">
              <div className="p-2 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-100 tracking-wider">
                Suggestions
              </div>
              <ul className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {suggestions.map((item) => (
                  <li key={item.slug}>
                    <button
                      onClick={() => {
                        setShowSuggestions(false);
                        navigate(`/product/${item.slug}`);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-indigo-50/70 flex items-center justify-between text-sm group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                        <span className="font-medium text-slate-900 group-hover:text-indigo-600">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                        {item.brand}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* User Account Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden lg:block leading-tight text-xs">
                <span className="text-[10px] text-slate-400 block">
                  {user ? `Hello, ${user.name.split(" ")[0]}` : "Sign in"}
                </span>
                <span className="font-bold text-white block">Account</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
            </button>

            {/* Account Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 text-slate-800 animate-scale-in">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {user.role === "admin" && (
                        <span className="mt-1 inline-block text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        Your Profile & Addresses
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        Your Orders & Tracking
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        Your Wishlist ({wishlistCount})
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors border-t border-slate-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 px-2">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100 text-center">
                      <Link
                        to="/login"
                        onClick={() => setShowUserMenu(false)}
                        className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                      >
                        Sign In
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-2">
                        New customer?{" "}
                        <Link
                          to="/register"
                          onClick={() => setShowUserMenu(false)}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          Start here.
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon with badge */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-slate-300 hover:text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
            <span className="hidden xl:inline text-xs font-semibold text-slate-300">
              Wishlist
            </span>
          </Link>

          {/* Cart Icon with badge */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-1.5 py-0.2 rounded-full">
              {cartItemCount}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Secondary Bar: Categories & Quick Links */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 text-xs font-medium overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-3 py-2 whitespace-nowrap">
          {/* Mega Menu Toggle Button */}
          <button
            onClick={onToggleMegaMenu}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              isMegaMenuOpen
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>All Categories</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Deals of the Day Highlight */}
          <Link
            to="/deals"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-amber-400 hover:bg-slate-800 font-bold transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Today's Deals</span>
          </Link>

          {/* Dynamic 11 Category Direct Links */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
