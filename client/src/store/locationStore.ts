import { create } from "zustand";

interface LocationState {
  pincode: string;
  city: string;
  isModalOpen: boolean;
  setLocation: (pincode: string, city: string) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  pincode: localStorage.getItem("shopsphere_pincode") || "400001",
  city: localStorage.getItem("shopsphere_city") || "Mumbai",
  isModalOpen: false,

  setLocation: (pincode: string, city: string) => {
    localStorage.setItem("shopsphere_pincode", pincode);
    localStorage.setItem("shopsphere_city", city);
    set({ pincode, city, isModalOpen: false });
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
