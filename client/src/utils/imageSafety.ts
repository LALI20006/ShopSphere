import { getCategoryFallbackImage } from "./categoryFallbacks";
import { Product } from "../types";

export const BLOCKED_IMAGE_IDS = new Set<string>([
  "1474552226712-ac0f0961a954", // couple kissing
  "1513279922550-250c2129b13a", // couple in bed
  "1521033719794-41049d18b8d4", // couple embracing
  "1591969851586-adbbd4accf81", // romantic couple
  "1700353612860-bd8ab8d71f05", // couple romance
  "1683121105193-837e90f41085", // couple romance
  "1539998045166-682834a24072", // couple romance
  "1661370340223-75244c00ef7e", // couple romance
  "1568663521381-33b7c467fda0", // underwear model bedroom
  "1610241519159-8a62634bac9a", // model shirtless
  "1583900985737-6d0495555783", // bedroom intimate
  "1568441556126-f36ae0900180", // model intimate
  "1526404746352-668ded9b50ab", // model intimate
  "1683134407316-0246a46f33bc", // model intimate
  "1607800371996-37476086c7e4", // iPhone home screen screenshot mismatched on books
  "1706403615881-d83dc2067c5d", // iPhone home screen screenshot mismatched on books
]);

const SUSPECT_URL_PATTERNS = [
  "kiss",
  "erotic",
  "lingerie",
  "nude",
  "bedroom",
  "bikini",
  "intimate",
  "sensual",
  "naked",
];

export function isImageSafe(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  // Internally generated SVG product visuals and category fallbacks are verified safe
  if (url.startsWith("data:image/svg")) return true;

  const lower = url.toLowerCase();

  for (const badId of BLOCKED_IMAGE_IDS) {
    if (lower.includes(badId)) {
      return false;
    }
  }

  for (const pattern of SUSPECT_URL_PATTERNS) {
    const regex = new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`, "i");
    if (regex.test(lower)) {
      return false;
    }
  }

  return true;
}

export function isImageCategoryCompatible(url: string, category?: string, subcategory?: string): boolean {
  if (!isImageSafe(url)) return false;

  const cat = (category || "").toLowerCase();
  const sub = (subcategory || "").toLowerCase();

  // Algolia BestBuy dataset contains electronics/phone accessories
  // Reject them if assigned to non-electronics categories (books, fashion, beauty, sports, toys, home, etc.)
  if (url.includes("cdn-demo.algolia.com")) {
    const isElectronics =
      cat.includes("mobi") ||
      cat.includes("comp") ||
      cat.includes("elec") ||
      cat.includes("tv") ||
      cat.includes("appliance") ||
      sub.includes("phone") ||
      sub.includes("laptop") ||
      sub.includes("audio") ||
      sub.includes("headphone");
    if (!isElectronics) {
      return false;
    }
  }

  // Books must NEVER use couple photos, phone screenshots, or tech images
  if (cat === "books" || sub.includes("book") || sub.includes("exam") || sub === "romance") {
    if (url.includes("algolia.com")) return false;
    if (url.includes("1607800371996") || url.includes("1706403615881")) return false;
    for (const badId of BLOCKED_IMAGE_IDS) {
      if (url.includes(badId)) return false;
    }
  }

  return true;
}

export function resolveSafeProductImage(product: Partial<Product>, preferredIndex: number = 0): string {
  const images = product.images || [];
  const primaryCandidate = images[preferredIndex] || images[0] || product.thumbnail;

  if (
    primaryCandidate &&
    isImageCategoryCompatible(primaryCandidate, product.category, product.subcategory)
  ) {
    return primaryCandidate;
  }

  for (let i = 0; i < images.length; i++) {
    if (i === preferredIndex) continue;
    const alt = images[i];
    if (alt && isImageCategoryCompatible(alt, product.category, product.subcategory)) {
      return alt;
    }
  }

  if (product.variantImages) {
    for (const varKey of Object.keys(product.variantImages)) {
      const varList = product.variantImages[varKey] || [];
      for (const varImg of varList) {
        if (isImageCategoryCompatible(varImg, product.category, product.subcategory)) {
          return varImg;
        }
      }
    }
  }

  return getCategoryFallbackImage(product.category, product.subcategory, product.name);
}
