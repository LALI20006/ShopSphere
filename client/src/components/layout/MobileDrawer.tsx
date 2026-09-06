import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ChevronDown,
  User,
  ShoppingBag,
  Package,
  Heart,
  Flame,
  HelpCircle,
  LogOut,
  MapPin,
} from "lucide-react";
import { Category } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { useLocationStore } from "../../store/locationStore";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const { user, logout } = useAuthStore();
  const { city, pincode, openModal } = useLocationStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCategory = (slug: string) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-right">
        {/* Header with User Info */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Hello,</p>
              <p className="font-bold text-sm text-white">
                {user ? user.name : "Welcome to ShopSphere"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location selector strip */}
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Deliver to <b>{city} {pincode}</b></span>
          </div>
          <button
            onClick={() => {
              onClose();
              openModal();
            }}
            className="text-indigo-300 font-semibold hover:underline"
          >
            Change
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-sm text-slate-800">
          {/* Quick shortcuts */}
          <div className="p-3 space-y-1">
            <Link
              to="/deals"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-600 font-bold bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Today's Top Deals</span>
            </Link>
            <Link
              to="/orders"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Your Orders & Tracking</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Your Wishlist</span>
            </Link>
          </div>

          {/* Categories Section with Accordion */}
          <div className="py-2">
            <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shop by Department
            </div>
            <div className="divide-y divide-slate-50">
              {categories.map((cat) => {
                const isExpanded = expandedCategory === cat.slug;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="font-semibold text-slate-900 text-xs flex-1"
                      >
                        {cat.name}
                      </Link>
                      <button
                        onClick={() => toggleCategory(cat.slug)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        aria-label={`Expand ${cat.name}`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-indigo-600" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Accordion subcategories */}
                    {isExpanded && (
                      <div className="bg-slate-50/80 px-4 py-2 space-y-1.5 border-t border-slate-100">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${cat.slug}/${sub.slug}`}
                            onClick={onClose}
                            className="block py-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium pl-2 border-l-2 border-transparent hover:border-indigo-600"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account & Settings */}
          <div className="p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Help & Settings
            </div>
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="block text-xs font-semibold text-slate-700 hover:text-indigo-600"
                >
                  Your Account
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="block text-xs font-bold text-purple-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full text-center py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="block w-full text-center py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
