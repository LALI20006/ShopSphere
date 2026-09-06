import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-subtle p-3 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-slate-200/80 rounded-lg mb-3" />
      <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
      <div className="h-4 w-full bg-slate-200 rounded mb-1" />
      <div className="h-4 w-3/4 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
      <div className="h-5 w-28 bg-slate-200 rounded mb-3 mt-auto" />
      <div className="h-9 w-full bg-slate-200 rounded-lg" />
    </div>
  );
};

export const CatalogSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex gap-4">
          <div className="w-20 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-slate-200 rounded-lg" />
            ))}
          </div>
          <div className="flex-1 aspect-square bg-slate-200 rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-full bg-slate-200 rounded" />
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-10 w-48 bg-slate-200 rounded" />
          <div className="h-24 w-full bg-slate-200 rounded-xl" />
          <div className="h-32 w-full bg-slate-200 rounded-xl" />
        </div>
        <div className="lg:col-span-3">
          <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-12 w-full bg-slate-200 rounded-xl" />
            <div className="h-12 w-full bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = "h-4 w-full" }) => {
  return <div className={`bg-slate-200/80 rounded-lg animate-pulse ${className}`} />;
};

