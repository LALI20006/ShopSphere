import { Product } from "../types";
import { isImageCategoryCompatible, isImageSafe } from "./imageSafety";

export interface ValidationIssue {
  productId: string;
  productName: string;
  category: string;
  subcategory: string;
  issue: string;
  culpritUrl?: string;
}

export interface ValidationReport {
  valid: boolean;
  totalProducts: number;
  uniqueBaseImagesCount: number;
  duplicateCount: number;
  categoryMismatchesCount: number;
  safetyViolationsCount: number;
  issues: ValidationIssue[];
}

export function getImageCanonicalKey(url: string): string {
  if (!url) return "";
  if (url.startsWith("data:image/svg")) {
    return url;
  }
  return url.split("?")[0].trim().toLowerCase();
}

export function isImageAlreadyUsed(
  url: string,
  catalog: Product[],
  currentProductId?: string
): boolean {
  if (!url) return false;
  const targetKey = getImageCanonicalKey(url);

  for (const p of catalog) {
    if (currentProductId && p.id === currentProductId) continue;
    const primaryKey = getImageCanonicalKey(p.thumbnail || p.images[0] || "");
    if (primaryKey && primaryKey === targetKey) {
      return true;
    }
    if (!url.startsWith("data:")) {
      for (const img of p.images || []) {
        if (getImageCanonicalKey(img) === targetKey) {
          return true;
        }
      }
    }
  }

  return false;
}

export function validateProductImages(products: Product[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  const claimedPrimaryKeys = new Map<string, { id: string; name: string }>();

  let duplicateCount = 0;
  let categoryMismatchesCount = 0;
  let safetyViolationsCount = 0;

  for (const p of products) {
    const primaryUrl = p.images?.[0] || p.thumbnail || "";

    if (!primaryUrl) {
      issues.push({
        productId: p.id,
        productName: p.name,
        category: p.category,
        subcategory: p.subcategory,
        issue: "Missing primary product image/thumbnail",
      });
      continue;
    }

    if (!isImageSafe(primaryUrl)) {
      safetyViolationsCount++;
      issues.push({
        productId: p.id,
        productName: p.name,
        category: p.category,
        subcategory: p.subcategory,
        issue: "Violated safety guidelines (inappropriate or blocked photo ID)",
        culpritUrl: primaryUrl,
      });
    }

    if (!isImageCategoryCompatible(primaryUrl, p.category, p.subcategory)) {
      categoryMismatchesCount++;
      issues.push({
        productId: p.id,
        productName: p.name,
        category: p.category,
        subcategory: p.subcategory,
        issue: `Category mismatch: Image not compatible with category ${p.category}/${p.subcategory}`,
        culpritUrl: primaryUrl,
      });
    }

    const canonKey = getImageCanonicalKey(primaryUrl);
    if (claimedPrimaryKeys.has(canonKey)) {
      const prior = claimedPrimaryKeys.get(canonKey)!;
      duplicateCount++;
      issues.push({
        productId: p.id,
        productName: p.name,
        category: p.category,
        subcategory: p.subcategory,
        issue: `Duplicate image: Shares identical visual identity with "${prior.name}" (${prior.id})`,
        culpritUrl: primaryUrl,
      });
    } else {
      claimedPrimaryKeys.set(canonKey, { id: p.id, name: p.name });
    }
  }

  return {
    valid: issues.length === 0,
    totalProducts: products.length,
    uniqueBaseImagesCount: claimedPrimaryKeys.size,
    duplicateCount,
    categoryMismatchesCount,
    safetyViolationsCount,
    issues,
  };
}
