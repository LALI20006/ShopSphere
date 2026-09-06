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
  passwordHash: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  addresses: Address[];
  wishlist: string[]; // array of product ids
  createdAt: string;
}

export type SafeUser = Omit<User, "passwordHash">;
