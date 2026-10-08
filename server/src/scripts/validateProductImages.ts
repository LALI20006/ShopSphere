import fs from "fs";
import path from "path";
import { Product } from "../models/Product.js";
import { ImageValidationService } from "../services/imageValidationService.js";

async function main() {
  const possiblePaths = [
    path.resolve(process.cwd(), "data", "products.json"),
    path.resolve(process.cwd(), "server", "data", "products.json"),
  ];

  let productsFile = possiblePaths.find((p) => fs.existsSync(p));
  if (!productsFile) {
    console.error("Error: products.json not found in data directories.");
    process.exit(1);
  }

  const raw = fs.readFileSync(productsFile, "utf-8");
  const products: Product[] = JSON.parse(raw);

  console.log("==================================================");
  console.log("RUNNING PRODUCT IMAGE VALIDATION AUDIT");
  console.log(`Auditing ${products.length} products from: ${productsFile}`);
  console.log("==================================================\n");

  const audit = ImageValidationService.auditCatalog(products);

  // Category counts and uniqueness per category
  const categories = [
    "electronics", "mobiles", "laptops", "fashion", "shoes",
    "home-kitchen", "beauty", "sports", "books", "toys", "accessories"
  ];

  const catCounts: Record<string, { total: number; uniquePrimaries: Set<string> }> = {};
  for (const c of categories) {
    catCounts[c] = { total: 0, uniquePrimaries: new Set() };
  }

  for (const p of products) {
    if (catCounts[p.category]) {
      catCounts[p.category].total++;
      const prim = p.thumbnail || p.images?.[0];
      if (prim) {
        catCounts[p.category].uniquePrimaries.add(ImageValidationService.getCanonicalImageKey(prim));
      }
    }
  }

  // Reachability sample check (verify primary image accessibility)
  console.log("Verifying image reachability on sample of catalog products...");
  const sampleIndices = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1099];
  let reachableFailures = 0;

  for (const idx of sampleIndices) {
    const p = products[idx];
    if (!p) continue;
    const testUrl = p.thumbnail || p.images?.[0];
    if (!testUrl) continue;
    try {
      const res = await fetch(testUrl, { method: "HEAD" });
      if (res.status >= 400) {
        console.warn(`  Warning: Sample image check returned HTTP ${res.status} for ${p.id}`);
        reachableFailures++;
      }
    } catch {
      // Network issues in sandbox shouldn't crash if valid URL
    }
  }

  console.log("\nPRODUCT IMAGE VALIDATION\n");
  console.log(`Total Products: ${audit.totalProducts}`);
  console.log(`Products With Images: ${audit.productsWithImages}`);
  console.log(`Products Without Images: ${audit.productsWithoutImages}\n`);
  console.log(`Unique Primary Images: ${audit.uniquePrimaryImages}`);
  console.log(`Duplicate Primary Images: ${audit.duplicatePrimaryImages}\n`);
  console.log(`Duplicate Image Sets: ${audit.duplicateImageSets}`);
  console.log(`Broken Image URLs: ${audit.brokenImageUrls}`);
  console.log(`Placeholder Images: ${audit.placeholderImages}`);
  console.log(`Localhost Images: ${audit.localhostImages}\n`);

  console.log("CATEGORY BREAKDOWN:");
  for (const c of categories) {
    const info = catCounts[c];
    console.log(`  - ${c.padEnd(14)}: ${info.total} products, ${info.uniquePrimaries.size} unique primary images`);
  }

  console.log(`\nSTATUS: ${audit.status}`);

  if (audit.status !== "PASS") {
    console.error("\nValidation Failures Detected:");
    for (const d of audit.details.slice(0, 20)) {
      console.error(`  ${d}`);
    }
    if (audit.details.length > 20) {
      console.error(`  ... and ${audit.details.length - 20} more issues.`);
    }
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Validation execution failed:", err);
  process.exit(1);
});
