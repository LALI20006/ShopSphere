import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, Home, ShoppingBag } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50 text-center">
      <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-inner">
        <Compass className="w-12 h-12 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
        404 Error - Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
        Looking for Something?
      </h1>
      <p className="text-slate-500 max-w-md text-sm sm:text-base mb-8">
        We couldn't find the page you were searching for. The product or link may have been updated or moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 text-xs sm:text-sm"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/deals"
          className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 text-xs sm:text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Today's Deals
        </Link>
      </div>
    </div>
  );
};
