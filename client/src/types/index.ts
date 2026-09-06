export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  itemCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bannerImage: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  numReviews?: number;
  stock: number;
  sku: string;
  images: string[];
  specifications: Record<string, string>;
  features: string[];
  colors?: string[];
  sizes?: string[];
  flavors?: string[];
  deliveryDays: number;
  freeDelivery: boolean;
  seller: string;
  tags: string[];
  isFeatured?: boolean;
  isDealOfDay?: boolean;
  dealEndsAt?: string;
  isBestSeller?: boolean;
  dealBadge?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  addressType: "Home" | "Work" | "Other";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
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

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountAmount: number;
  description: string;
}

export interface ProductFilterQuery {
  category?: string;
  subcategory?: string;
  search?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  hasDiscount?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "best-selling" | "discount";
  page?: number;
  limit?: number;
}
