import fs from "fs";
import path from "path";

const CATEGORY_QUERIES: Record<string, string[]> = {
  laptops: [
    "macbook pro", "thinkpad laptop", "dell xps laptop", "gaming laptop",
    "hp laptop", "asus laptop", "surface laptop", "ultrabook",
    "laptop keyboard", "laptop desk", "macbook air", "razer laptop",
    "acer laptop", "laptop screen", "laptop workspace", "laptop aluminum"
  ],
  mobiles: [
    "iphone", "samsung galaxy", "google pixel", "smartphone",
    "oneplus", "mobile phone", "android phone", "iphone 15",
    "phone screen", "phone camera", "minimal phone", "cellular phone"
  ],
  electronics: [
    "headphones", "television 4k", "camera dslr", "speaker audio",
    "soundbar", "canon camera", "mechanical keyboard", "earbuds",
    "smartwatch", "studio microphone", "monitor screen", "drone camera"
  ],
  fashion: [
    "mens shirt", "denim jacket", "suit blazer", "summer dress",
    "cotton tshirt", "hoodie clothing", "winter coat", "linen shirt",
    "fashion apparel", "kurta fabric", "streetwear jacket", "polo shirt"
  ],
  shoes: [
    "nike sneakers", "running shoes", "oxford shoes leather", "adidas sneakers",
    "casual sneakers", "leather loafers", "basketball shoes", "boots leather",
    "white sneakers", "training gym shoes", "derby shoes", "suede shoes"
  ],
  "home-kitchen": [
    "espresso machine", "cookware pan", "air fryer", "blender kitchen",
    "stand mixer", "chef knife", "electric kettle", "toaster stainless",
    "food processor", "ceramic bowl tableware", "kitchen pot", "coffee grinder"
  ],
  beauty: [
    "skincare serum bottle", "perfume bottle", "lipstick cosmetic", "face cream moisturizer",
    "face wash pump", "makeup bottle", "facial oil bottle", "lotion dispenser",
    "eau de parfum", "toner mist bottle", "eye cream cosmetics", "cosmetic products"
  ],
  sports: [
    "dumbbells fitness", "yoga mat exercise", "soccer ball football", "badminton racket",
    "tennis racket", "kettlebell gym", "boxing gloves", "resistance bands workout",
    "bicycle helmet", "basketball leather", "jump rope fitness", "cricket bat"
  ],
  books: [
    "hardcover book", "open book reading", "stack of books", "novel book",
    "architecture design book", "business book", "vintage book", "technology book",
    "psychology book", "textbook study", "book cover design", "paperback book"
  ],
  toys: [
    "lego building blocks", "rc car toy", "wooden toy blocks", "board game family",
    "action figure collectible", "robot toy stem", "dollhouse toy", "teddy bear plush",
    "drone toy", "jigsaw puzzle", "toy car model", "kids construction toy"
  ],
  accessories: [
    "phone case leather", "wall charger usb-c", "wireless power bank", "smartwatch strap",
    "laptop sleeve", "braided usb cable", "leather wallet cardholder", "wireless charging pad",
    "sunglasses fashion", "tech pouch travel", "laptop stand aluminum", "desk mat workspace"
  ],
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function harvest() {
  console.log("=== HARVESTING FULL CANONICAL IMAGE URLS FOR 11 CATEGORIES ===");
  const results: Record<string, string[]> = {};
  const globalUrls = new Set<string>();

  for (const [cat, queries] of Object.entries(CATEGORY_QUERIES)) {
    console.log(`\nGathering for: ${cat}...`);
    const catUrls = new Set<string>();

    for (const q of queries) {
      if (catUrls.size >= 110) break;

      for (let page = 1; page <= 3; page++) {
        if (catUrls.size >= 110) break;

        try {
          const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(q)}&per_page=30&page=${page}`;
          const res = await fetch(url);
          if (!res.ok) {
            console.log(`  Query "${q}" page ${page} status: ${res.status}`);
            await sleep(250);
            continue;
          }
          const json = (await res.json()) as any;
          const items = json?.results || [];
          for (const item of items) {
            const rawUrl = item.urls?.raw || item.urls?.regular || "";
            if (!rawUrl) continue;
            const cleanUrl = rawUrl.split("?")[0];
            if (cleanUrl.startsWith("http") && !globalUrls.has(cleanUrl)) {
              globalUrls.add(cleanUrl);
              catUrls.add(cleanUrl);
            }
          }
          console.log(`  [${cat}] query "${q}" (p${page}) -> Cat unique: ${catUrls.size}, Global total: ${globalUrls.size}`);
          await sleep(200);
        } catch (err: any) {
          console.error(`  Fetch error for "${q}":`, err.message);
          await sleep(400);
        }
      }
    }

    results[cat] = Array.from(catUrls);
    console.log(`✓ Completed category "${cat}": ${results[cat].length} unique clean image URLs.`);
  }

  const outDir = path.resolve(process.cwd(), "src", "data");
  const jsonPath = path.join(outDir, "uniquePhotosCatalog.json");
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf-8");

  console.log(`\nSuccessfully saved photo catalog to ${jsonPath}`);
  console.log(`Global total unique photos: ${globalUrls.size}`);
}

harvest().catch(console.error);
