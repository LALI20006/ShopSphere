import React from "react";
import { Truck, Zap, Check } from "lucide-react";

interface DeliveryStepProps {
  speed: "standard" | "express";
  onSelectSpeed: (speed: "standard" | "express") => void;
  subtotal: number;
  onProceed: () => void;
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  speed,
  onSelectSpeed,
  subtotal,
  onProceed,
}) => {
  const standardCost = subtotal >= 499 ? 0 : 49;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Select Delivery Option</h3>
        <p className="text-xs text-slate-500">Choose how fast you want your order delivered</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Standard Delivery */}
        <div
          onClick={() => onSelectSpeed("standard")}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            speed === "standard"
              ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Truck className="w-5 h-5" />
            </div>
            {speed === "standard" && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <h4 className="font-bold text-slate-900 text-sm mb-1">Standard Delivery</h4>
          <p className="text-xs text-slate-500 mb-3">Estimated arrival in 3-5 business days</p>

          <div className="pt-2 border-t border-slate-100 font-extrabold text-sm text-slate-900">
            {standardCost === 0 ? (
              <span className="text-emerald-600">FREE</span>
            ) : (
              <span>₹{standardCost}</span>
            )}
          </div>
        </div>

        {/* Express Delivery */}
        <div
          onClick={() => onSelectSpeed("express")}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            speed === "express"
              ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            {speed === "express" && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <h4 className="font-bold text-slate-900 text-sm">ShopSphere Express</h4>
            <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
              FAST
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Guaranteed priority delivery in 1-2 business days</p>

          <div className="pt-2 border-t border-slate-100 font-extrabold text-sm text-slate-900">
            ₹99
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onProceed}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};
