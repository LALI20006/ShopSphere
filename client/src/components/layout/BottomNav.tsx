import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Flame, Heart, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";

interface BottomNavProps {
  onOpenCategories: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCategories }) => {
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-1 px-2">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            isActive("/") ? "text-indigo-600 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Categories Drawer Trigger */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-slate-500 font-medium hover:text-indigo-600 transition-colors"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* Deals */}
        <Link
          to="/deals"
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            isActive("/deals") ? "text-amber-600 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Deals</span>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors relative ${
            isActive("/wishlist") ? "text-indigo-600 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-1 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px]">Wishlist</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors relative ${
            isActive("/cart") ? "text-indigo-600 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px]">Cart</span>
        </Link>

        {/* Profile */}
        <Link
          to={user ? "/profile" : "/login"}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            isActive("/profile") || isActive("/login")
              ? "text-indigo-600 font-bold"
              : "text-slate-500 font-medium"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{user ? "Account" : "Sign In"}</span>
        </Link>
      </div>
    </div>
  );
};
