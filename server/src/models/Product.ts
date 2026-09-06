export interface Product {
  id: string;
  name: string;
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
