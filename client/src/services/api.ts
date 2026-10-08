import axios from "axios";
import { Product, Category, User, Order, Address, Review, ProductFilterQuery, Brand } from "../types";

const api = axios.create({
  baseURL: ((import.meta as any).env?.VITE_API_URL as string) || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token (checks persistent localStorage first, then session storage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopsphere_token") || sessionStorage.getItem("shopsphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth APIs ---
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>("/auth/login", credentials).then((r) => r.data),

  register: (userData: { name: string; email: string; password: string; phone?: string }) =>
    api.post<{ user: User; token: string; message?: string }>("/auth/register", userData).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<{ success: boolean; message: string; demoCode?: string }>("/auth/forgot-password", { email }).then((r) => r.data),

  verifyResetCode: (email: string, code: string) =>
    api.post<{ valid: boolean; message: string }>("/auth/verify-reset-code", { email, code }).then((r) => r.data),

  resetPassword: (payload: { email: string; code: string; newPassword: string }) =>
    api.post<{ success: boolean; message: string }>("/auth/reset-password", payload).then((r) => r.data),

  getMe: () =>
    api.get<{ user: User }>("/auth/me").then((r) => r.data),

  updateProfile: (profile: { name?: string; phone?: string }) =>
    api.put<{ user: User }>("/auth/profile", profile).then((r) => r.data),

  addAddress: (address: Omit<Address, "id">) =>
    api.post<{ address: Address; addresses: Address[] }>("/auth/addresses", address).then((r) => r.data),

  updateAddress: (id: string, address: Partial<Address>) =>
    api.put<{ address: Address; addresses: Address[] }>(`/auth/addresses/${id}`, address).then((r) => r.data),

  deleteAddress: (id: string) =>
    api.delete<{ message: string; addresses: Address[] }>(`/auth/addresses/${id}`).then((r) => r.data),

  toggleWishlist: (productId: string) =>
    api.post<{ wishlist: string[] }>("/auth/wishlist/toggle", { productId }).then((r) => r.data),
};

// --- Product APIs ---
export const productApi = {
  getCategories: () =>
    api.get<{ categories: Category[] }>("/products/categories").then((r) => r.data),

  getBrands: (category?: string) =>
    api.get<{ brands: Brand[] }>("/products/brands", { params: { category } }).then((r) => r.data),

  getProducts: (params: ProductFilterQuery) =>
    api.get<{ products: Product[]; total: number; page: number; totalPages: number }>("/products", { params }).then((r) => r.data),

  getProductByIdOrSlug: (idOrSlug: string) =>
    api.get<{ product: Product }>(`/products/${idOrSlug}`).then((r) => r.data),

  getSearchSuggestions: (q: string) =>
    api.get<{ suggestions: { name: string; brand: string; category: string; slug: string }[] }>("/products/search/suggestions", { params: { q } }).then((r) => r.data),

  getDeals: (limit = 12) =>
    api.get<{ deals: Product[] }>("/products/deals", { params: { limit } }).then((r) => r.data),

  getFeatured: (limit = 12) =>
    api.get<{ featured: Product[] }>("/products/featured", { params: { limit } }).then((r) => r.data),

  getRelated: (id: string, limit = 8) =>
    api.get<{ related: Product[] }>(`/products/${id}/related`, { params: { limit } }).then((r) => r.data),
};

// --- Order APIs ---
export const orderApi = {
  createOrder: (orderData: any) =>
    api.post<{ order: Order }>("/orders", orderData).then((r) => r.data),

  getMyOrders: () =>
    api.get<{ orders: Order[] }>("/orders").then((r) => r.data),

  getOrderById: (id: string) =>
    api.get<{ order: Order }>(`/orders/${id}`).then((r) => r.data),

  cancelOrder: (id: string) =>
    api.post<{ order: Order; message: string }>(`/orders/${id}/cancel`).then((r) => r.data),
};

// --- Review APIs ---
export const reviewApi = {
  getProductReviews: (productId: string) =>
    api.get<{ reviews: Review[] }>(`/reviews/product/${productId}`).then((r) => r.data),

  submitReview: (reviewData: { productId: string; rating: number; title: string; comment: string }) =>
    api.post<{ review: Review }>("/reviews", reviewData).then((r) => r.data),
};

// --- Coupon APIs ---
export const couponApi = {
  validateCoupon: (code: string, cartAmount: number) =>
    api.post<{ valid: boolean; code: string; discountAmount: number; description: string }>("/coupons/validate", { code, cartAmount }).then((r) => r.data),
};

// --- Admin APIs ---
export const adminApi = {
  getAnalytics: () =>
    api.get<{ analytics: any }>("/admin/analytics").then((r) => r.data),

  getOrders: () =>
    api.get<{ orders: Order[] }>("/admin/orders").then((r) => r.data),

  updateOrderStatus: (id: string, status: string) =>
    api.put<{ order: Order; message: string }>(`/admin/orders/${id}/status`, { status }).then((r) => r.data),

  createProduct: (product: any) =>
    api.post<{ product: Product }>("/admin/products", product).then((r) => r.data),

  updateProduct: (id: string, product: any) =>
    api.put<{ product: Product }>(`/admin/products/${id}`, product).then((r) => r.data),

  deleteProduct: (id: string) =>
    api.delete<{ message: string }>(`/admin/products/${id}`).then((r) => r.data),
};

export default api;
