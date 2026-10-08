export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  storage?: string;
  ram?: string;
  price: number;
  originalPrice: number;
  stock: number;
  images: string[];
  availability: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface Inventory {
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  availabilityStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface Product {
  id: string;
  productId?: string;
  name: string;
  productName?: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  productType?: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  tax?: number;
  rating: number;
  reviewsCount: number;
  numReviews?: number;
  title?: string;
  stock: number;
  thumbnail?: string;
  images: string[];
  variant?: string;
  color?: string;
  variantImages?: Record<string, string[]>;
  specifications: Record<string, string>;
  features: string[];
  colors?: string[];
  sizes?: string[];
  flavors?: string[];
  dimensions?: string;
  weight?: string;
  material?: string;
  variants?: ProductVariant[];
  inventory?: Inventory;
  tags: string[];
  warranty?: string;
  returnInfo?: string;
  shippingInfo?: string;
  deliveryDays: number;
  freeDelivery: boolean;
  seller: string;
  isFeatured?: boolean;
  isDealOfDay?: boolean;
  dealEndsAt?: string;
  isBestSeller?: boolean;
  dealBadge?: string;
  createdAt: string;
  updatedAt?: string;
  productStatus?: "ACTIVE" | "ARCHIVED" | "DRAFT";
}

export interface ProductFilterQuery {
  category?: string;
  subcategory?: string;
  search?: string;
  brand?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  hasDiscount?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "best-selling" | "discount";
  page?: number;
  limit?: number;
}
