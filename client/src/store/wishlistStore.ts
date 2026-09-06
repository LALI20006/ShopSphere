import { create } from "zustand";
import { Product } from "../types";
import { authApi } from "../services/api";

interface WishlistState {
  items: Product[];
  wishlistIds: string[];
  toggleWishlist: (product: Product, isLoggedIn?: boolean) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  setWishlist: (products: Product[]) => void;
}

const WISHLIST_STORAGE_KEY = "shopsphere_wishlist_items";

function loadStoredWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useWishlistStore = create<WishlistState>((set, get) => {
  const initialItems = loadStoredWishlist();
  return {
    items: initialItems,
    wishlistIds: initialItems.map((p) => p.id),

    toggleWishlist: async (product, isLoggedIn = false) => {
      const items = [...get().items];
      const exists = items.some((p) => p.id === product.id);

      let updated: Product[];
      if (exists) {
        updated = items.filter((p) => p.id !== product.id);
      } else {
        updated = [product, ...items];
      }

      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      set({ items: updated, wishlistIds: updated.map((p) => p.id) });

      if (isLoggedIn) {
        try {
          await authApi.toggleWishlist(product.id);
        } catch (err) {
          console.error("Failed to sync wishlist with server", err);
        }
      }
    },

    isInWishlist: (productId) => {
      return get().wishlistIds.includes(productId);
    },

    removeItem: (productId) => {
      const updated = get().items.filter((p) => p.id !== productId);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      set({ items: updated, wishlistIds: updated.map((p) => p.id) });
    },

    setWishlist: (products) => {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(products));
      set({ items: products, wishlistIds: products.map((p) => p.id) });
    },
  };
});
