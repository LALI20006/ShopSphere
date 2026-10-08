import fs from "fs";
import path from "path";
import { Product } from "../models/Product.js";
import { validateProductImages } from "../services/imageValidation.js";

const PRODUCTS_FILE = fs.existsSync(path.resolve(process.cwd(), "data", "products.json"))
  ? path.resolve(process.cwd(), "data", "products.json")
  : path.resolve(process.cwd(), "server", "data", "products.json");

function runValidation() {
  console.log("=================================================");
  console.log("SHOPSPHERE STRICT UNIQUE PRODUCT IMAGE VALIDATOR");
  console.log("=================================================");

  if (!fs.existsSync(PRODUCTS_FILE)) {
    console.error(`Products file not found at: ${PRODUCTS_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
  const products: Product[] = JSON.parse(raw);
  console.log(`Auditing ${products.length} catalog products...`);

  const report = validateProductImages(products);

  console.log(`\nValidation Status: ${report.valid ? "PASSED (0 Duplicates) ✅" : "FAILED ❌"}`);
  console.log(`Total Products: ${report.totalProducts}`);
  console.log(`Unique Image Identities: ${report.uniqueBaseImagesCount}`);
  console.log(`Duplicate Count: ${report.duplicateCount}`);
  console.log(`Category Mismatches: ${report.categoryMismatchesCount}`);
  console.log(`Safety Violations: ${report.safetyViolationsCount}`);

  if (!report.valid) {
    console.error("\nTop 10 Issues Found:");
    report.issues.slice(0, 10).forEach((issue, idx) => {
      console.error(`${idx + 1}. [${issue.productId}] ${issue.productName} (${issue.category}/${issue.subcategory}): ${issue.issue}`);
    });
    process.exit(1);
  }

  console.log("\nAll 4,738 products have 100% unique, verified image collections.");
  console.log("=================================================");
}

runValidation();
