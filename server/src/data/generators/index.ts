import fs from "fs";
import path from "path";
import { Product } from "../../models/Product.js";
import { SEED_PRODUCTS } from "../seedProducts.js";
import { CATEGORIES } from "../categories.js";
import { generateProduct } from "./utils.js";
import { SubcategoryConfig } from "./types.js";

import { mobilesComputersConfigs } from "./mobilesComputers.js";
import { tvElectronicsConfigs } from "./tvElectronics.js";
import { appliancesConfigs } from "./appliances.js";
import { mensFashionConfigs } from "./mensFashion.js";
import { womensFashionConfigs } from "./womensFashion.js";
import { homeKitchenConfigs } from "./homeKitchen.js";
import { beautyHealthConfigs } from "./beautyHealth.js";
import { sportsBagsConfigs } from "./sportsBags.js";
import { toysBabyKidsConfigs } from "./toysBabyKids.js";
import { carIndustrialConfigs } from "./carIndustrial.js";
import { booksMediaGamesConfigs } from "./booksMediaGames.js";

export const ALL_SUBCATEGORY_CONFIGS: SubcategoryConfig[] = [
  ...mobilesComputersConfigs,
  ...tvElectronicsConfigs,
  ...appliancesConfigs,
  ...mensFashionConfigs,
  ...womensFashionConfigs,
  ...homeKitchenConfigs,
  ...beautyHealthConfigs,
  ...sportsBagsConfigs,
  ...toysBabyKidsConfigs,
  ...carIndustrialConfigs,
  ...booksMediaGamesConfigs,
];

export function generateCompleteCatalog(): Product[] {
  const existingIds = new Set<string>();
  const existingSkus = new Set<string>();
  const existingSlugs = new Set<string>();

  const catalog: Product[] = [];

  // 1. First, register and add all curated existing seed products
  for (const p of SEED_PRODUCTS) {
    if (!existingIds.has(p.id) && !existingSkus.has(p.sku) && !existingSlugs.has(p.slug)) {
      existingIds.add(p.id);
      existingSkus.add(p.sku);
      existingSlugs.add(p.slug);
      catalog.push(p);
    }
  }

  // Count existing products per subcategory
  const productsBySubcategory = new Map<string, Product[]>();
  for (const p of catalog) {
    const sub = p.subcategory.toLowerCase();
    if (!productsBySubcategory.has(sub)) {
      productsBySubcategory.set(sub, []);
    }
    productsBySubcategory.get(sub)!.push(p);
  }

  // 2. For every subcategory in our comprehensive hierarchy, ensure AT LEAST 30 products
  for (const config of ALL_SUBCATEGORY_CONFIGS) {
    const subKey = config.subcategorySlug.toLowerCase();
    const currentList = productsBySubcategory.get(subKey) || [];
    const needed = Math.max(0, 30 - currentList.length);

    for (let i = 0; i < needed; i++) {
      const generated = generateProduct(
        config,
        currentList.length + i,
        existingSlugs,
        existingSkus,
        existingIds
      );
      catalog.push(generated);
      if (!productsBySubcategory.has(subKey)) {
        productsBySubcategory.set(subKey, []);
      }
      productsBySubcategory.get(subKey)!.push(generated);
    }
  }

  return catalog;
}

export function saveCatalogToFile(outputPath?: string): string {
  const targetPath = outputPath || path.resolve(process.cwd(), "data", "products.json");
  const dataDir = path.dirname(targetPath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const catalog = generateCompleteCatalog();
  fs.writeFileSync(targetPath, JSON.stringify(catalog, null, 2), "utf-8");
  console.log(`Successfully generated and saved ${catalog.length} products to ${targetPath}`);
  return targetPath;
}

// Allow direct CLI execution: node dist/data/generators/index.js
if (process.argv[1] && process.argv[1].includes("generators")) {
  saveCatalogToFile();
}
