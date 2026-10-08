import { DataStore } from "../services/store.js";
import { CATEGORIES } from "../data/categories.js";

const store = DataStore.getInstance();

console.log("=== ShopSphere Catalog Verification ===");
const totalProducts = store.getProducts({}).total;
console.log(`Total Products in Catalog: ${totalProducts}`);

const categories = store.getCategories();
console.log(`Total Categories: ${categories.length}`);

console.log("\n--- Verification Per Category (Target: 100 per category) ---");
let allPassed = true;

for (const cat of categories) {
  const res = store.getProducts({ category: cat.slug, limit: 150 });
  const count = res.total;
  const status = count === 100 ? "PASS" : "FAIL";
  console.log(`Category: ${cat.name.padEnd(20)} [${cat.slug.padEnd(16)}] : Count = ${count} -> ${status}`);
  if (count !== 100) allPassed = false;
}

console.log("\n--- Brand Verification ---");
const brandsRes = store.getBrands();
console.log(`Total Registered Brands: ${brandsRes.length}`);

console.log("\n--- Category Attributes & Variant Integrity Sample ---");
const sampleCats = ["mobiles", "laptops", "shoes", "fashion", "books"];
for (const slug of sampleCats) {
  const sample = store.getProducts({ category: slug, limit: 1 }).products[0];
  if (sample) {
    console.log(`\nSample Product [${slug}]: ${sample.name}`);
    console.log(`- Brand: ${sample.brand}`);
    console.log(`- Images: ${sample.images.length} photos`);
    console.log(`- Colors: ${sample.colors?.join(", ") || "N/A"}`);
    console.log(`- Sizes: ${sample.sizes?.join(", ") || "None (Category Specific)"}`);
    console.log(`- Variants: ${sample.variants?.length || 0} variant SKUs`);
    console.log(`- Specifications keys: ${Object.keys(sample.specifications).join(", ")}`);
    console.log(`- Inventory: stock=${sample.inventory?.stockQuantity}, status=${sample.inventory?.availabilityStatus}`);
  }
}

if (totalProducts === 1100 && categories.length === 11 && allPassed) {
  console.log("\n SUCCESS: All 1,100 products across 11 categories verified perfectly!");
} else {
  console.error("\n FAILED: Discrepancy found!");
  process.exit(1);
}
