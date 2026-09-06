import React, { useState } from "react";
import { CreditCard, QrCode, Banknote, ShieldCheck, Check, Sparkles } from "lucide-react";

interface PaymentStepProps {
  method: "demo" | "upi" | "card" | "netbanking" | "cod";
  onSelectMethod: (method: "demo" | "upi" | "card" | "netbanking" | "cod") => void;
  totalAmount: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  method,
  onSelectMethod,
  totalAmount,
  onPlaceOrder,
  isProcessing,
}) => {
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8921");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("•••");
  const [cardName, setCardName] = useState("RAHUL SHARMA");

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Select Payment Method</h3>
        <p className="text-xs text-slate-500">All transactions are encrypted and simulated securely</p>
      </div>

      <div className="space-y-3">
        {/* Option 1: Express 1-Click Pay (Recommended) */}
        <div
          onClick={() => onSelectMethod("demo")}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            method === "demo"
              ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Express 1-Click Pay</h4>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Fastest
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Instant secure payment with automated order verification
                </p>
              </div>
            </div>
            {method === "demo" && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Option 2: UPI */}
        <div
          onClick={() => onSelectMethod("upi")}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            method === "upi"
              ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">UPI / QR Code</h4>
                <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>
            {method === "upi" && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {method === "upi" && (
            <div className="mt-3 pt-3 border-t border-indigo-100 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter your Virtual Payment Address (VPA) / UPI ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Option 3: Credit / Debit Card */}
        <div
          onClick={() => onSelectMethod("card")}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            method === "card"
              ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Credit or Debit Card</h4>
                <p className="text-xs text-slate-500">Visa, MasterCard, RuPay, Diners Club</p>
              </div>
            </div>
            {method === "card" && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {method === "card" && (
            <div className="mt-4 pt-3 border-t border-indigo-100 animate-fade-in space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valid Thru (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Option 4: Cash on Delivery */}
        <div
          onClick={() => onSelectMethod("cod")}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            method === "cod"
              ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h4>
                <p className="text-xs text-slate-500">Pay cash or scan QR when delivery agent arrives</p>
              </div>
            </div>
            {method === "cod" && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trust reassurance banner */}
      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Your payment is processed through 256-bit bank-grade encryption.</span>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Processing Your Order...
            </span>
          ) : (
            <span>Place Order • {formatINR(totalAmount)}</span>
          )}
        </button>
      </div>
    </div>
  );
};
