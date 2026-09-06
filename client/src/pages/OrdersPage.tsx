import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  ArrowRight,
  Truck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ExternalLink,
  RotateCw,
} from "lucide-react";
import { Order } from "../types";
import { orderApi } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/orders");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case "Out for Delivery":
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
            <Truck className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return !["Delivered", "Cancelled"].includes(o.orderStatus);
    if (filterStatus === "delivered") return o.orderStatus === "Delivered";
    if (filterStatus === "cancelled") return o.orderStatus === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="w-7 h-7 text-indigo-600" />
              <span>Your Orders</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Check the status of current orders and review your past purchases.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === "active"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilterStatus("delivered")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === "delivered"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === "cancelled"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No orders found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              You haven't placed any orders in this category yet. Explore thousands of items in our catalog!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-200"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm overflow-hidden transition-all"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-slate-400 block font-medium">ORDER PLACED</span>
                      <span className="font-semibold text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">TOTAL</span>
                      <span className="font-bold text-slate-900">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">SHIP TO</span>
                      <span className="font-semibold text-slate-700">
                        {order.shippingAddress.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-slate-400 block font-medium">ORDER # {order.orderNumber}</span>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Items in order */}
                <div className="p-5">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${item.productId}-${idx}`}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                              {item.name}
                            </h4>
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

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors"
                          >
                            Track Package
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Order Bar */}
                <div className="bg-slate-50/50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Estimated Delivery:{" "}
                    <strong className="text-indigo-700">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </strong>
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View Order Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
