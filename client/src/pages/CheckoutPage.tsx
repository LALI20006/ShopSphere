import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { Address, Order } from "../types";
import { AddressStep } from "../components/checkout/AddressStep";
import { DeliveryStep } from "../components/checkout/DeliveryStep";
import { PaymentStep } from "../components/checkout/PaymentStep";
import { orderApi } from "../services/api";
import { ImageWithFallback } from "../components/common/ImageWithFallback";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items,
    appliedCoupon,
    getSubtotal,
    getOriginalTotal,
    getDiscount,
    getDeliveryFee,
    getCouponDiscount,
    getGrandTotal,
    clearCart,
  } = useCartStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"demo" | "upi" | "card" | "netbanking" | "cod">("demo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Initialize selected address from user's defaults
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user]);

  const subtotal = getSubtotal();
  const originalTotal = getOriginalTotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee(deliverySpeed);
  const couponDiscount = getCouponDiscount();
  const grandTotal = getGrandTotal(deliverySpeed);

  // Redirect if empty cart and not on success screen
  useEffect(() => {
    if (items.length === 0 && currentStep !== 4) {
      navigate("/cart");
    }
  }, [items, currentStep, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError("Please select a valid delivery address.");
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);
    setOrderError("");

    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          originalPrice: i.product.originalPrice,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
        })),
        shippingAddress: selectedAddress,
        deliverySpeed,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await orderApi.createOrder(orderPayload);
      setCreatedOrder(res.order);
      clearCart();
      setCurrentStep(4);
    } catch (err: any) {
      console.error("Order creation failed", err);
      setOrderError(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: Success Screen
  if (currentStep === 4 && createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce-short">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Thank you for your order!
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Order <strong className="text-slate-800">{createdOrder.orderNumber}</strong> has been successfully placed and is now being prepared for shipping.
          </p>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 mt-6 text-left space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Order ID</span>
              <span className="font-mono font-bold text-slate-800">{createdOrder.id}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-bold text-indigo-700">
                {new Date(createdOrder.estimatedDelivery).toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Total Paid</span>
              <span className="font-bold text-slate-900">
                ₹{createdOrder.total.toLocaleString("en-IN")} via {createdOrder.paymentMethod.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Delivering To</span>
              <span className="font-medium text-slate-700 text-right">
                {createdOrder.shippingAddress.fullName}, {createdOrder.shippingAddress.city} - {createdOrder.shippingAddress.pincode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => navigate(`/orders/${createdOrder.id}`)}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <PackageCheck className="w-4 h-4" />
              Track Order Live
            </button>
            <Link
              to="/"
              className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Delivery Address", icon: MapPin },
    { num: 2, label: "Delivery Speed", icon: Truck },
    { num: 3, label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Checkout Header & Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Checkout
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Secure Checkout
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-sm">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  disabled={!isPast && !isActive}
                  onClick={() => isPast && setCurrentStep(s.num as any)}
                  className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : isPast
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-white text-indigo-600"
                        : isPast
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isPast ? "✓" : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {orderError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{orderError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Step */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-8 shadow-sm">
            {currentStep === 1 && (
              <AddressStep
                selectedAddress={selectedAddress}
                onSelectAddress={(addr) => setSelectedAddress(addr)}
                onProceed={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <DeliveryStep
                speed={deliverySpeed}
                onSelectSpeed={(spd) => setDeliverySpeed(spd)}
                subtotal={subtotal}
                onProceed={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <PaymentStep
                method={paymentMethod}
                onSelectMethod={(m) => setPaymentMethod(m)}
                totalAmount={grandTotal}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            )}
          </div>

          {/* Sticky Order Review Panel */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-slate-500 font-normal">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </h2>

              {/* Items preview preview */}
              <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                    className="flex items-center gap-3 text-xs"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        Qty: {item.quantity}
                        {item.selectedColor && ` • ${item.selectedColor}`}
                        {item.selectedSize && ` • ${item.selectedSize}`}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Retail Savings</span>
                    <span>- ₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>
                    Delivery ({deliverySpeed === "express" ? "Express 2-Day" : "Standard 4-Day"})
                  </span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-base">Total Payable</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Selected Delivery Address Preview */}
              {selectedAddress && (
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-medium mb-1">
                    <span>Deliver to:</span>
                    {currentStep > 1 && (
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  <p className="font-bold text-slate-800">{selectedAddress.fullName}</p>
                  <p className="text-slate-600 line-clamp-1">
                    {selectedAddress.houseFlat}, {selectedAddress.street}, {selectedAddress.city} - {selectedAddress.pincode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
