import { Product } from "../models/Product.js";
import { isImageCategoryCompatible, isImageSafe } from "./imageSafety.js";

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

/**
 * Extracts the canonical identity key of an image URL.
 * Strips volatile query parameters while preserving distinct photo / SVG identifiers.
 */
export function getImageCanonicalKey(url: string): string {
  if (!url) return "";
  if (url.startsWith("data:image/svg")) {
    // For generated SVG data URIs, the entire URI is unique per product
    return url;
  }
  // Strip query parameters for Unsplash or CDN photos
  return url.split("?")[0].trim().toLowerCase();
}

/**
 * Checks if an image URL is already claimed by another product in the catalog.
 */
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
    // Also check remaining gallery images if not generated SVG
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

/**
 * Comprehensive global catalog validation engine.
 */
export function validateProductImages(products: Product[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  const claimedPrimaryKeys = new Map<string, { id: string; name: string }>();

  let duplicateCount = 0;
  let categoryMismatchesCount = 0;
  let safetyViolationsCount = 0;

  for (const p of products) {
    const primaryUrl = p.images?.[0] || p.thumbnail || "";

    // 1. Check presence
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

    // 2. Check safety
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

    // 3. Check category compatibility
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

    // 4. Global Uniqueness Check
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
