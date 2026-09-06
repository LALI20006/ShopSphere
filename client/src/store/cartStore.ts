import { create } from "zustand";
import { CartItem, Product, Coupon } from "../types";
import { couponApi } from "../services/api";

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  appliedCoupon: Coupon | null;
  couponError: string | null;

  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;

  saveForLater: (productId: string, color?: string, size?: string) => void;
  moveToCart: (productId: string, color?: string, size?: string) => void;
  removeSavedItem: (productId: string, color?: string, size?: string) => void;

  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  getSubtotal: () => number;
  getOriginalTotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: (deliverySpeed?: "standard" | "express") => number;
  getCouponDiscount: () => number;
  getGrandTotal: (deliverySpeed?: "standard" | "express") => number;
  getItemCount: () => number;
}

const CART_STORAGE_KEY = "shopsphere_cart_items";
const SAVED_STORAGE_KEY = "shopsphere_saved_items";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadFromStorage<CartItem[]>(CART_STORAGE_KEY, []),
  savedForLater: loadFromStorage<CartItem[]>(SAVED_STORAGE_KEY, []),
  appliedCoupon: null,
  couponError: null,

  addItem: (product, quantity = 1, selectedColor, selectedSize) => {
    const hasToken = Boolean(
      localStorage.getItem("shopsphere_token") || sessionStorage.getItem("shopsphere_token")
    );
    if (!hasToken) {
      return;
    }

    const items = [...get().items];
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + quantity;
      items[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      items.push({
        productId: product.id,
        product,
        quantity: Math.min(quantity, product.stock),
        selectedColor,
        selectedSize,
      });
    }

    saveToStorage(CART_STORAGE_KEY, items);
    set({ items });
  },

  updateQuantity: (productId, quantity, selectedColor, selectedSize) => {
    if (quantity <= 0) {
      get().removeItem(productId, selectedColor, selectedSize);
      return;
    }

    const items = get().items.map((item) => {
      if (
        item.productId === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      ) {
        return {
          ...item,
          quantity: Math.min(quantity, item.product.stock),
        };
      }
      return item;
    });

    saveToStorage(CART_STORAGE_KEY, items);
    set({ items });
  },

  removeItem: (productId, selectedColor, selectedSize) => {
    const items = get().items.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        )
    );
    saveToStorage(CART_STORAGE_KEY, items);
    set({ items });
  },

  clearCart: () => {
    saveToStorage(CART_STORAGE_KEY, []);
    set({ items: [], appliedCoupon: null, couponError: null });
  },

  saveForLater: (productId, selectedColor, selectedSize) => {
    const item = get().items.find(
      (i) =>
        i.productId === productId &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize
    );
    if (!item) return;

    get().removeItem(productId, selectedColor, selectedSize);
    const saved = [...get().savedForLater, item];
    saveToStorage(SAVED_STORAGE_KEY, saved);
    set({ savedForLater: saved });
  },

  moveToCart: (productId, selectedColor, selectedSize) => {
    const item = get().savedForLater.find(
      (i) =>
        i.productId === productId &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize
    );
    if (!item) return;

    const saved = get().savedForLater.filter(
      (i) =>
        !(
          i.productId === productId &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
        )
    );
    saveToStorage(SAVED_STORAGE_KEY, saved);
    set({ savedForLater: saved });

    get().addItem(item.product, item.quantity, item.selectedColor, item.selectedSize);
  },

  removeSavedItem: (productId, selectedColor, selectedSize) => {
    const saved = get().savedForLater.filter(
      (i) =>
        !(
          i.productId === productId &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
        )
    );
    saveToStorage(SAVED_STORAGE_KEY, saved);
    set({ savedForLater: saved });
  },

  applyCoupon: async (code) => {
    set({ couponError: null });
    const subtotal = get().getSubtotal();
    try {
      const res = await couponApi.validateCoupon(code, subtotal);
      set({
        appliedCoupon: {
          code: res.code,
          discountAmount: res.discountAmount,
          description: res.description,
        },
        couponError: null,
      });
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid coupon code";
      set({ couponError: msg, appliedCoupon: null });
      return false;
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, couponError: null });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },

  getOriginalTotal: () => {
    return get().items.reduce((sum, i) => sum + i.product.originalPrice * i.quantity, 0);
  },

  getDiscount: () => {
    const orig = get().getOriginalTotal();
    const sub = get().getSubtotal();
    return Math.max(0, orig - sub);
  },

  getDeliveryFee: (deliverySpeed = "standard") => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    if (deliverySpeed === "express") return 99;
    return subtotal >= 499 ? 0 : 49;
  },

  getCouponDiscount: () => {
    return get().appliedCoupon?.discountAmount || 0;
  },

  getGrandTotal: (deliverySpeed = "standard") => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const delivery = get().getDeliveryFee(deliverySpeed);
    const couponDiscount = get().getCouponDiscount();
    return Math.max(0, subtotal + delivery - couponDiscount);
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
