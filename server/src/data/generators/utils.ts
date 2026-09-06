import { Product } from "../../models/Product.js";
import { SubcategoryConfig } from "./types.js";

// Helper to generate a clean, URL-safe slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Deterministic PRNG seeded per subcategory and index
export function createRng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Generate an array of 3-5 images using the subcategory image pool
export function buildImageGallery(imagePool: string[], productIndex: number, rng: () => number): string[] {
  if (!imagePool || imagePool.length === 0) {
    return [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    ];
  }

  const primaryIndex = productIndex % imagePool.length;
  const gallery: string[] = [imagePool[primaryIndex]];

  // Add 2-4 additional angle/lifestyle photos
  const count = 3 + Math.floor(rng() * 3); // 3 to 5 images
  for (let i = 1; i < count; i++) {
    const nextIdx = (primaryIndex + i) % imagePool.length;
    const baseImg = imagePool[nextIdx];
    // Add crop / angle parameter if same photo is used
    if (gallery.includes(baseImg)) {
      gallery.push(`${baseImg}&angle=${i + 1}`);
    } else {
      gallery.push(baseImg);
    }
  }

  return gallery;
}

// Create a full product from template and config
export function generateProduct(
  config: SubcategoryConfig,
  index: number,
  existingSlugs: Set<string>,
  existingSkus: Set<string>,
  existingIds: Set<string>
): Product {
  const rng = createRng(`${config.subcategorySlug}-${index}`);
  const templateIdx = index % config.productTemplates.length;
  const template = config.productTemplates[templateIdx];
  const brand = config.brands[index % config.brands.length];

  // Raw name with brand substitution if needed
  let rawName = template.namePattern.replace("{brand}", brand);
  if (!rawName.includes(brand)) {
    rawName = `${brand} ${rawName}`;
  }

  // Ensure unique slug
  let baseSlug = slugify(rawName);
  let finalSlug = baseSlug;
  let slugModifier = 1;
  while (existingSlugs.has(finalSlug)) {
    slugModifier++;
    finalSlug = `${baseSlug}-${slugModifier}`;
  }
  existingSlugs.add(finalSlug);

  // Ensure unique ID
  const shortSub = config.subcategorySlug.replace(/[^a-z0-9]/g, "").slice(0, 4);
  let id = `prod-${shortSub}-${(index + 1).toString().padStart(3, "0")}`;
  if (existingIds.has(id)) {
    id = `prod-${shortSub}-${Date.now().toString().slice(-4)}-${index + 1}`;
  }
  existingIds.add(id);

  // Ensure unique SKU
  const brandCode = brand.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3).padEnd(3, "X");
  const subCode = config.subcategorySlug.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
  let sku = `SKU-${subCode}-${brandCode}-${1000 + index}`;
  let skuMod = 1;
  while (existingSkus.has(sku)) {
    sku = `SKU-${subCode}-${brandCode}-${1000 + index}-${skuMod++}`;
  }
  existingSkus.add(sku);

  // Price calculation
  const { min, max } = config.priceRange;
  const rawPrice = min + rng() * (max - min);
  const roundFactor = rawPrice > 10000 ? 100 : rawPrice > 1000 ? 50 : 10;
  const price = Math.round(rawPrice / roundFactor) * roundFactor;
  const discountPercent = 10 + Math.floor(rng() * 36); // 10% to 45%
  const originalPrice = Math.round((price / (1 - discountPercent / 100)) / roundFactor) * roundFactor;

  // Rating & review count
  const rating = Number((3.8 + rng() * 1.1).toFixed(1)); // 3.8 to 4.9
  const reviewsCount = 15 + Math.floor(rng() * rng() * 12500);

  // Stock: 10% low stock (2-8), 3% out of stock (0), 87% plentiful (20-150)
  const stockRoll = rng();
  let stock = Math.floor(25 + rng() * 125);
  if (stockRoll < 0.03) {
    stock = 0; // Out of stock
  } else if (stockRoll < 0.12) {
    stock = Math.floor(2 + rng() * 7); // Low stock
  }

  // Delivery days & free delivery
  const deliveryDays = 1 + Math.floor(rng() * 3);
  const freeDelivery = price >= 499;

  // Badges & flags
  const isBestSeller = reviewsCount > 2000 && rating >= 4.4;
  const isDealOfDay = discountPercent >= 30;
  const isFeatured = rating >= 4.6 || isBestSeller;
  let dealBadge: string | undefined = undefined;
  if (isBestSeller) dealBadge = "Best Seller";
  else if (isDealOfDay) dealBadge = "Deal of the Day";
  else if (discountPercent >= 25) dealBadge = "Limited Time Deal";

  // Sellers
  const sellers = [
    `${brand} Official Store`,
    "ShopSphere Retail Direct",
    "Cloudtail Electronics India",
    "Appario Retail Solutions",
    "Prime Sellers Network",
  ];
  const seller = sellers[index % sellers.length];

  // Images
  const images = buildImageGallery(config.imagePool, index, rng);

  // Tags
  const baseTags = [
    brand.toLowerCase(),
    config.subcategorySlug.replace(/-/g, " "),
    config.name.toLowerCase(),
    ...template.tags,
  ];
  const tags = Array.from(new Set(baseTags));

  return {
    id,
    sku,
    name: rawName,
    slug: finalSlug,
    brand,
    category: config.categorySlug,
    subcategory: config.subcategorySlug,
    description: template.description.replace(/{brand}/g, brand).replace(/{name}/g, rawName),
    shortDescription: template.shortDescription.replace(/{brand}/g, brand),
    price,
    originalPrice,
    discountPercent,
    rating,
    reviewsCount,
    stock,
    images,
    specifications: template.specifications,
    features: template.features,
    colors: template.colors,
    sizes: template.sizes,
    deliveryDays,
    freeDelivery,
    seller,
    tags,
    isFeatured,
    isBestSeller,
    isDealOfDay,
    dealBadge,
    createdAt: new Date(Date.now() - Math.floor(rng() * 120) * 86400000).toISOString(),
  };
}
