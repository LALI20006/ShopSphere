export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}
