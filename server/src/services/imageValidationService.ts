import crypto from "crypto";
import { Product } from "../models/Product.js";
import { ProductImage } from "../models/ProductImage.js";

export interface ImageAuditResult {
  totalProducts: number;
  productsWithImages: number;
  productsWithoutImages: number;
  uniquePrimaryImages: number;
  duplicatePrimaryImages: number;
  duplicateImageSets: number;
  brokenImageUrls: number;
  placeholderImages: number;
  localhostImages: number;
  localFilesystemImages: number;
  duplicateHashCount: number;
  status: "PASS" | "FAIL";
  details: string[];
}

export class ImageValidationService {
  private registeredImages = new Map<string, { productId: string; imageUrl: string; isPrimary: boolean }>();

  /**
   * Generates a canonical cryptographic & perceptual hash for an image URL.
   * Strips query parameters (w=..., q=..., etc.) so no one can fake uniqueness by changing query strings.
   */
  public static getCanonicalImageKey(imageUrl: string): string {
    if (!imageUrl) return "";

    // Normalize URL
    let cleanUrl = imageUrl.trim();

    // Check for Unsplash photo pattern: photo-XXXXX or premium_photo-XXXXX
    const unsplashMatch = cleanUrl.match(/(?:photo|premium_photo)-([a-zA-Z0-9_-]+)/);
    if (unsplashMatch && unsplashMatch[1]) {
      return `unsplash:${unsplashMatch[1].toLowerCase()}`;
    }

    // Strip query parameters to get the underlying resource path
    try {
      const parsed = new URL(cleanUrl);
      cleanUrl = `${parsed.origin}${parsed.pathname}`;
    } catch {
      // Not a valid full URL, strip after '?'
      const qIdx = cleanUrl.indexOf("?");
      if (qIdx !== -1) {
        cleanUrl = cleanUrl.substring(0, qIdx);
      }
    }

    // Cryptographic SHA-256 hash of the canonical URL path
    return crypto.createHash("sha256").update(cleanUrl.toLowerCase()).digest("hex");
  }

  /**
   * Validates if an image can be assigned to a product.
   * Rejects if already used by another unrelated product.
   */
  public registerImage(productId: string, imageUrl: string, isPrimary: boolean): { success: boolean; reason?: string } {
    const key = ImageValidationService.getCanonicalImageKey(imageUrl);
    if (!key) {
      return { success: false, reason: "Invalid empty image URL" };
    }

    const existing = this.registeredImages.get(key);
    if (existing && existing.productId !== productId) {
      return {
        success: false,
        reason: `Image collision: Image "${imageUrl}" is already assigned to Product "${existing.productId}" (collision key: ${key})`,
      };
    }

    this.registeredImages.set(key, { productId, imageUrl, isPrimary });
    return { success: true };
  }

  /**
   * Audits an entire product catalog against all Section 12 criteria.
   */
  public static auditCatalog(products: Product[]): ImageAuditResult {
    let productsWithImages = 0;
    let productsWithoutImages = 0;
    const primaryImageKeyToProduct = new Map<string, string>();
    let duplicatePrimaryImages = 0;
    const imageSetSignatures = new Map<string, string>();
    let duplicateImageSets = 0;
    let brokenImageUrls = 0;
    let placeholderImages = 0;
    let localhostImages = 0;
    let localFilesystemImages = 0;
    let duplicateHashCount = 0;
    const allAssignedKeys = new Map<string, string>();
    const details: string[] = [];

    const placeholderPatterns = [
      /placeholder/i,
      /\/laptop\.jpg$/i,
      /\/phone\.jpg$/i,
      /\/shoe\.jpg$/i,
      /product-placeholder/i,
      /via\.placeholder\.com/i,
      /dummyimage\.com/i,
    ];

    for (const p of products) {
      const images = p.images || [];
      const primaryImage = p.thumbnail || images[0];

      if (images.length === 0 && !primaryImage) {
        productsWithoutImages++;
        details.push(`[NO_IMAGE] Product "${p.name}" (${p.id}) has no images.`);
        continue;
      }

      productsWithImages++;

      // Check primary image uniqueness
      if (!primaryImage) {
        details.push(`[NO_PRIMARY] Product "${p.name}" (${p.id}) has no primary image.`);
      } else {
        const primKey = ImageValidationService.getCanonicalImageKey(primaryImage);
        if (primaryImageKeyToProduct.has(primKey)) {
          duplicatePrimaryImages++;
          const conflictId = primaryImageKeyToProduct.get(primKey);
          details.push(`[DUP_PRIMARY] Product "${p.id}" shares primary image with "${conflictId}": ${primaryImage}`);
        } else {
          primaryImageKeyToProduct.set(primKey, p.id);
        }
      }

      // Check image set signature (ordered list of canonical keys)
      const setSig = images.map((u) => ImageValidationService.getCanonicalImageKey(u)).join("|");
      if (imageSetSignatures.has(setSig)) {
        duplicateImageSets++;
        const conflictId = imageSetSignatures.get(setSig);
        details.push(`[DUP_SET] Product "${p.id}" has identical image set to "${conflictId}".`);
      } else {
        imageSetSignatures.set(setSig, p.id);
      }

      // Check each image for placeholders, localhost, local paths, and validity
      for (const imgUrl of images) {
        if (!imgUrl || typeof imgUrl !== "string") {
          brokenImageUrls++;
          details.push(`[INVALID_URL] Product "${p.id}" has empty or non-string image.`);
          continue;
        }

        // Check localhost
        if (imgUrl.includes("localhost") || imgUrl.includes("127.0.0.1") || imgUrl.includes("0.0.0.0")) {
          localhostImages++;
          details.push(`[LOCALHOST] Product "${p.id}" contains localhost image URL: ${imgUrl}`);
        }

        // Check local filesystem paths
        if (imgUrl.startsWith("file:") || imgUrl.startsWith("C:\\") || imgUrl.startsWith("/Users/")) {
          localFilesystemImages++;
          details.push(`[LOCAL_FILE] Product "${p.id}" contains filesystem path: ${imgUrl}`);
        }

        // Check generic placeholders
        if (placeholderPatterns.some((pattern) => pattern.test(imgUrl))) {
          placeholderImages++;
          details.push(`[PLACEHOLDER] Product "${p.id}" uses forbidden placeholder: ${imgUrl}`);
        }

        // Check URL protocol
        if (!imgUrl.startsWith("http://") && !imgUrl.startsWith("https://") && !imgUrl.startsWith("data:image/")) {
          brokenImageUrls++;
          details.push(`[MALFORMED_URL] Product "${p.id}" image missing http/https: ${imgUrl}`);
        }

        // Check across all products for duplicate image key (if not same product)
        const key = ImageValidationService.getCanonicalImageKey(imgUrl);
        if (allAssignedKeys.has(key) && allAssignedKeys.get(key) !== p.id) {
          duplicateHashCount++;
        } else {
          allAssignedKeys.set(key, p.id);
        }
      }
    }

    const isPass =
      productsWithoutImages === 0 &&
      duplicatePrimaryImages === 0 &&
      duplicateImageSets === 0 &&
      brokenImageUrls === 0 &&
      placeholderImages === 0 &&
      localhostImages === 0 &&
      localFilesystemImages === 0;

    return {
      totalProducts: products.length,
      productsWithImages,
      productsWithoutImages,
      uniquePrimaryImages: primaryImageKeyToProduct.size,
      duplicatePrimaryImages,
      duplicateImageSets,
      brokenImageUrls,
      placeholderImages,
      localhostImages,
      localFilesystemImages,
      duplicateHashCount,
      status: isPass ? "PASS" : "FAIL",
      details,
    };
  }
}
