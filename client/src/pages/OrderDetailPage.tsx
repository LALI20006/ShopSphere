import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  AlertTriangle,
  XCircle,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Order, OrderStatus } from "../types";
import { orderApi } from "../services/api";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await orderApi.getOrderById(id);
      setOrder(res.order);
    } catch (err) {
      console.error("Failed to load order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("Are you sure you want to cancel this order?")) return;
    setIsCancelling(true);
    try {
      const res = await orderApi.cancelOrder(order.id);
      setOrder(res.order);
      setCancelMessage("Order cancelled successfully. Refund will be processed if applicable.");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <LoadingSkeleton className="h-10 w-48 rounded-xl" />
          <LoadingSkeleton className="h-64 rounded-2xl" />
          <LoadingSkeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <p className="text-slate-500 text-sm mt-1 mb-4">We couldn't locate this order.</p>
        <Link to="/orders" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const STAGES: { status: OrderStatus; label: string }[] = [
    { status: "Ordered", label: "Ordered" },
    { status: "Confirmed", label: "Confirmed" },
    { status: "Packed", label: "Packed" },
    { status: "Shipped", label: "Shipped" },
    { status: "Out for Delivery", label: "Out for Delivery" },
    { status: "Delivered", label: "Delivered" },
  ];

  const currentStageIndex = STAGES.findIndex((s) => s.status === order.orderStatus);
  const isCancelled = order.orderStatus === "Cancelled";
  const canCancel = ["Ordered", "Confirmed", "Packed"].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Orders
          </Link>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <XCircle className="w-3.5 h-3.5" />
              {isCancelling ? "Cancelling..." : "Cancel This Order"}
            </button>
          )}
        </div>

        {cancelMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {cancelMessage}
          </div>
        )}

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                Order #{order.orderNumber}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isCancelled
                    ? "bg-rose-100 text-rose-700"
                    : order.orderStatus === "Delivered"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {isCancelled ? "Order Cancelled" : `Arriving by ${new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-right">
              <span className="block text-[11px] text-slate-400 font-medium">TOTAL PAID</span>
              <span className="text-lg font-black text-slate-900">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* 6-Stage Interactive Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Live Delivery Tracking
          </h2>

          {isCancelled ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center text-rose-800">
              <XCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
              <h3 className="font-bold text-sm">Order Cancelled</h3>
              <p className="text-xs text-rose-600 mt-1">
                This order was cancelled on {new Date(order.updatedAt).toLocaleDateString("en-IN")}.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Progress Line Desktop */}
              <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-100 z-0">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100)}%`,
                  }}
                />
              </div>

              {/* Steps Layout */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                {STAGES.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const stepHistory = order.trackingHistory.find((t) => t.status === stage.status);

                  return (
                    <div key={stage.status} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                      {/* Node Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                          isCompleted
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        } ${isCurrent ? "scale-110 ring-4 ring-indigo-200" : ""}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      {/* Label & date */}
                      <div className="md:text-center">
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? "text-indigo-600"
                              : isCompleted
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {stage.label}
                        </p>
                        {stepHistory?.date ? (
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {new Date(stepHistory.date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="block text-[10px] text-slate-300 mt-0.5">Pending</span>
                        )}
                        {stepHistory?.description && (
                          <p className="text-[11px] text-slate-500 mt-1 md:hidden">
                            {stepHistory.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Two Columns: Ordered Items & Shipping/Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Items List */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Items in This Shipment ({order.items.length})
            </h3>

            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div
                  key={`${item.productId}-${i}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        productName={item.name}
                        fit="contain"
                        className="w-full h-full p-1"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                      </div>
                    </div>
                  </div>

                  <span className="font-bold text-slate-900 text-sm">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Billing Summary */}
          <div className="md:col-span-4 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Delivery Address
              </h3>
              <p className="text-xs font-bold text-slate-800">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {order.shippingAddress.houseFlat}, {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-xs text-slate-500 mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Payment & Totals
              </h3>

              <div className="space-y-2 text-xs text-slate-600 pb-3 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-bold uppercase text-slate-800">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Retail Savings</span>
                    <span>- ₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon ({order.couponCode})</span>
                    <span>- ₹{order.couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline font-bold text-slate-900 pt-1">
                <span className="text-sm">Grand Total</span>
                <span className="text-lg font-black">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
