import { create } from "zustand";
import { User, Address } from "../types";
import { authApi } from "../services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("shopsphere_token") || sessionStorage.getItem("shopsphere_token"),
  isLoading: true,
  error: null,

  login: async (email, password, rememberMe = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      if (rememberMe) {
        // Persistent session across browser restarts
        localStorage.setItem("shopsphere_token", res.token);
        sessionStorage.removeItem("shopsphere_token");
      } else {
        // Non-persistent session (expires on browser close)
        sessionStorage.setItem("shopsphere_token", res.token);
        localStorage.removeItem("shopsphere_token");
      }
      set({ user: res.user, token: res.token, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed. Please check your credentials.";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (data, rememberMe = true) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.register(data);
      if (rememberMe) {
        localStorage.setItem("shopsphere_token", res.token);
        sessionStorage.removeItem("shopsphere_token");
      } else {
        sessionStorage.setItem("shopsphere_token", res.token);
        localStorage.removeItem("shopsphere_token");
      }
      set({ user: res.user, token: res.token, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed.";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem("shopsphere_token");
    sessionStorage.removeItem("shopsphere_token");
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("shopsphere_token") || sessionStorage.getItem("shopsphere_token");
    if (!token) {
      set({ user: null, token: null, isLoading: false });
      return;
    }
    try {
      const res = await authApi.getMe();
      set({ user: res.user, isLoading: false });
    } catch (err) {
      localStorage.removeItem("shopsphere_token");
      sessionStorage.removeItem("shopsphere_token");
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      set({ user: res.user });
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to update profile");
    }
  },

  addAddress: async (address) => {
    try {
      const res = await authApi.addAddress(address);
      const currentUser = get().user;
      if (currentUser) {
        set({ user: { ...currentUser, addresses: res.addresses } });
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to add address");
    }
  },

  updateAddress: async (id, address) => {
    try {
      const res = await authApi.updateAddress(id, address);
      const currentUser = get().user;
      if (currentUser) {
        set({ user: { ...currentUser, addresses: res.addresses } });
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to update address");
    }
  },

  deleteAddress: async (id) => {
    try {
      const res = await authApi.deleteAddress(id);
      const currentUser = get().user;
      if (currentUser) {
        set({ user: { ...currentUser, addresses: res.addresses } });
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to delete address");
    }
  },
}));
