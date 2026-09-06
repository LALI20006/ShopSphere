import { Product } from "../../models/Product.js";

export interface SubcategoryConfig {
  categorySlug: string;
  subcategorySlug: string;
  subcategoryId: string;
  name: string;
  brands: string[];
  priceRange: { min: number; max: number; typicalRound?: number };
  imagePool: string[];
  productTemplates: {
    namePattern: string;
    description: string;
    shortDescription: string;
    specifications: Record<string, string>;
    features: string[];
    colors?: string[];
    sizes?: string[];
    tags: string[];
  }[];
}
