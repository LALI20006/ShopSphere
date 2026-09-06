import { Address } from "./User.js";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus =
  | "Ordered"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface TrackingStep {
  status: OrderStatus;
  date: string;
  completed: boolean;
  current: boolean;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  shippingAddress: Address;
  deliverySpeed: "standard" | "express";
  deliveryFee: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
  paymentMethod: "cod" | "upi" | "card" | "netbanking" | "demo";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  orderStatus: OrderStatus;
  estimatedDelivery: string;
  trackingHistory: TrackingStep[];
  createdAt: string;
  updatedAt: string;
}
