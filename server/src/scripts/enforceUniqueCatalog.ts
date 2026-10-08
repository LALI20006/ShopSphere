import fs from "fs";
import path from "path";
import { Product } from "../models/Product.js";
import { isImageCategoryCompatible, isImageSafe } from "../services/imageSafety.js";
import { generateProductVisual, generateProductGallery } from "../services/productVisualGenerator.js";
import { validateProductImages, getImageCanonicalKey } from "../services/imageValidation.js";

const PRODUCTS_FILE = path.resolve(process.cwd(), "server", "data", "products.json");

// Curated authentic title mappings for Book subcategories to eliminate duplicate titles
const KINDLE_EBOOKS_DATA = [
  { name: "The Digital Minimalist: Focus in a Distracted World", brand: "Cal Newport", price: 399 },
  { name: "Atomic Habits: Tiny Changes, Remarkable Results", brand: "James Clear", price: 449 },
  { name: "Deep Work: Rules for Focused Success", brand: "Cal Newport", price: 429 },
  { name: "The Psychology of Money: Timeless Lessons", brand: "Morgan Housel", price: 349 },
  { name: "Sapiens: A Brief History of Humankind", brand: "Yuval Noah Harari", price: 499 },
  { name: "Thinking, Fast and Slow", brand: "Daniel Kahneman", price: 450 },
  { name: "The Lean Startup: Continuous Innovation", brand: "Eric Ries", price: 420 },
  { name: "Zero to One: Notes on Startups", brand: "Peter Thiel", price: 380 },
  { name: "Can't Hurt Me: Master Your Mind", brand: "David Goggins", price: 480 },
  { name: "Essentialism: The Disciplined Pursuit of Less", brand: "Greg McKeown", price: 399 },
  { name: "Show Your Work!: 10 Ways to Share Your Creativity", brand: "Austin Kleon", price: 299 },
  { name: "Steal Like an Artist: 10 Things Nobody Told You", brand: "Austin Kleon", price: 299 },
  { name: "Start with Why: How Great Leaders Inspire", brand: "Simon Sinek", price: 420 },
  { name: "Quiet: The Power of Introverts in a World That Can't Stop Talking", brand: "Susan Cain", price: 440 },
  { name: "Good to Great: Why Some Companies Make the Leap", brand: "Jim Collins", price: 520 },
  { name: "The 7 Habits of Highly Effective People", brand: "Stephen R. Covey", price: 490 },
  { name: "Man's Search for Meaning", brand: "Viktor E. Frankl", price: 280 },
  { name: "Ikigai: The Japanese Secret to a Long and Happy Life", brand: "Héctor García", price: 350 },
  { name: "The Subtle Art of Not Giving a F*ck", brand: "Mark Manson", price: 390 },
  { name: "Rich Dad Poor Dad: What the Rich Teach Their Kids", brand: "Robert T. Kiyosaki", price: 380 },
  { name: "Shoe Dog: A Memoir by the Creator of Nike", brand: "Phil Knight", price: 460 },
  { name: "Principles: Life and Work", brand: "Ray Dalio", price: 550 },
  { name: "Ego Is the Enemy", brand: "Ryan Holiday", price: 399 },
  { name: "The Obstacle Is the Way", brand: "Ryan Holiday", price: 399 },
  { name: "Grit: The Power of Passion and Perseverance", brand: "Angela Duckworth", price: 430 },
  { name: "Mindset: The New Psychology of Success", brand: "Carol S. Dweck", price: 410 },
  { name: "Outliers: The Story of Success", brand: "Malcolm Gladwell", price: 440 },
  { name: "Drive: The Surprising Truth About What Motivates Us", brand: "Daniel H. Pink", price: 380 },
  { name: "Hooked: How to Build Habit-Forming Products", brand: "Nir Eyal", price: 420 },
  { name: "Rework: Change The Way You Work Forever", brand: "Jason Fried", price: 390 },
];

const EXAM_CENTRAL_DATA = [
  { name: "UPSC Civil Services General Studies Paper I Manual", brand: "McGraw Hill", price: 1250 },
  { name: "Indian Polity for Civil Services Examination", brand: "M. Laxmikanth", price: 820 },
  { name: "Indian Economy: Principles and Policies", brand: "Ramesh Singh", price: 790 },
  { name: "History of Modern India & National Movement", brand: "Bipan Chandra", price: 490 },
  { name: "Certificate Physical and Human Geography", brand: "GC Leong", price: 360 },
  { name: "A Brief History of Modern India (Spectrum)", brand: "Rajiv Ahir", price: 410 },
  { name: "Environment & Ecology Comprehensive Guide", brand: "Shankar IAS", price: 680 },
  { name: "Internal Security & Disaster Management", brand: "Ashok Kumar IPS", price: 490 },
  { name: "Ethics, Integrity and Aptitude for Civil Services", brand: "Subba Rao & Roy", price: 580 },
  { name: "Governance in India for UPSC Prelims & Mains", brand: "M. Laxmikanth", price: 640 },
  { name: "India's Ancient Past (Oxford University Press)", brand: "R.S. Sharma", price: 420 },
  { name: "History of Medieval India (Orient Blackswan)", brand: "Satish Chandra", price: 450 },
  { name: "International Relations: Interests and Politics", brand: "Pavneet Singh", price: 690 },
  { name: "Science and Technology for Civil Services", brand: "Ravi P. Agrahari", price: 640 },
  { name: "Social Problems in India (Rawat Publications)", brand: "Ram Ahuja", price: 530 },
  { name: "State PSC Civil Services Preliminary Solved Papers", brand: "Arihant Experts", price: 620 },
  { name: "General Science for Competitive Exams", brand: "Disha Experts", price: 480 },
  { name: "UPSC CSAT Paper-II Analytical Reasoning & Aptitude", brand: "Arun Sharma", price: 750 },
  { name: "Economic Survey & Union Budget Analysis", brand: "Vision IAS", price: 390 },
  { name: "Current Affairs Annual Compendium for UPSC", brand: "Drishti IAS", price: 490 },
  { name: "UPSC 29 Years Chapterwise Solved Papers (1995-2024)", brand: "Disha Publication", price: 690 },
  { name: "Indian Art and Culture for Civil Services", brand: "Nitin Singhania", price: 720 },
  { name: "Macroeconomics: Standard Reference Guide", brand: "NCERT Editorial", price: 290 },
  { name: "Human Geography Fundamentals", brand: "Majid Husain", price: 560 },
  { name: "Challenge and Strategy: Rethinking India's Foreign Policy", brand: "Rajiv Sikri", price: 610 },
  { name: "India Since Independence: Analytical History", brand: "Bipan Chandra", price: 540 },
  { name: "Lexicon for Ethics, Integrity & Aptitude", brand: "Chronicle Books", price: 480 },
  { name: "State PSC General Studies Regional Geography & Heritage", brand: "Upkar Prakashan", price: 460 },
  { name: "Indian Constitution at Work: Legal Principles", brand: "NCERT Law Wing", price: 220 },
  { name: "UPSC Mains Essay Writing Masterclass", brand: "Anudeep Durishetty IAS", price: 490 },
];

const INDIAN_LITERATURE_DATA = [
  { name: "Godaan: The Gift of a Cow", brand: "Munshi Premchand", price: 280 },
  { name: "Gaban: Classic Hindi Social Novel", brand: "Munshi Premchand", price: 250 },
  { name: "Nirmala: Tragic Realist Masterpiece", brand: "Munshi Premchand", price: 220 },
  { name: "Maila Anchal: Groundbreaking Regional Epic", brand: "Phanishwar Nath Renu", price: 340 },
  { name: "Rashmirathi: Epic Poem of Karna", brand: "Ramdhari Singh Dinkar", price: 260 },
  { name: "Urvashi: Poetic Drama & National Award Winner", brand: "Ramdhari Singh Dinkar", price: 290 },
  { name: "Kamayani: Epic of Human Consciousness", brand: "Jaishankar Prasad", price: 310 },
  { name: "Yama: Poetic Collection & Jnanpith Awardee", brand: "Mahadevi Varma", price: 280 },
  { name: "Gunahon Ka Devta: Timeless Romance & Tragedy", brand: "Dharamvir Bharati", price: 299 },
  { name: "Suraj Ka Satwan Ghoda: Metaphysical Masterwork", brand: "Dharamvir Bharati", price: 230 },
  { name: "Tamas: Chronicle of Partition & Humanity", brand: "Bhisham Sahni", price: 350 },
  { name: "Madhushala: The House of Wine", brand: "Harivansh Rai Bachchan", price: 240 },
  { name: "Aadhe Adhure: Modern Existential Play", brand: "Mohan Rakesh", price: 210 },
  { name: "Ashadh Ka Ek Din: Classic Literary Drama", brand: "Mohan Rakesh", price: 220 },
  { name: "Raag Darbari: Satirical Portrait of Rural Power", brand: "Shrilal Shukla", price: 390 },
  { name: "Chidambara: Selected Poems & Jnanpith Anthology", brand: "Sumitranandan Pant", price: 320 },
  { name: "Kitne Pakistan: Partition & Historical Allegory", brand: "Kamleshwar", price: 360 },
  { name: "Volga Se Ganga: Historical Short Stories", brand: "Rahul Sankrityayan", price: 380 },
  { name: "Mrignayani: Historical Romance of Gwalior", brand: "Vrindavan Lal Verma", price: 330 },
  { name: "Anandmath: Patriotic Classic & Vande Mataram", brand: "Bankim Chandra Chattopadhyay", price: 260 },
  { name: "Devdas: Tragic Tale of Love and Longing", brand: "Sarat Chandra Chattopadhyay", price: 220 },
  { name: "Gitanjali: Song Offerings & Nobel Anthology", brand: "Rabindranath Tagore", price: 290 },
  { name: "Gora: Epic of Identity and Tolerance", brand: "Rabindranath Tagore", price: 380 },
  { name: "Chokher Bali: The Eyesore & Psychological Novel", brand: "Rabindranath Tagore", price: 270 },
  { name: "Pinjar: The Skeleton & Partition Novel", brand: "Amrita Pritam", price: 250 },
  { name: "Raseedi Ticket: Frank Autobiographical Musings", brand: "Amrita Pritam", price: 290 },
  { name: "Kafan and Other Celebrated Stories", brand: "Munshi Premchand", price: 210 },
  { name: "Shatranj Ke Khilari: The Chess Players", brand: "Munshi Premchand", price: 199 },
  { name: "Kurukshetra: Philosophical War Discourse", brand: "Ramdhari Singh Dinkar", price: 270 },
  { name: "Premchand Ki Lokpriya Kahaniyan", brand: "Rajkamal Prakashan", price: 340 },
];

function buildSingleProductGallery(primaryUrl: string): string[] {
  if (primaryUrl.startsWith("data:image/svg")) {
    // For generated SVG visuals, multi-angle views are generated via generateProductGallery
    return [primaryUrl];
  }
  const baseUrl = primaryUrl.split("?")[0];
  return [
    `${baseUrl}?w=800&q=80`,
    `${baseUrl}?w=800&q=80&crop=top&fit=crop`,
    `${baseUrl}?w=800&q=80&crop=bottom&fit=crop`,
    `${baseUrl}?w=800&q=80&crop=edges&fit=crop`,
  ];
}

async function enforceUniqueCatalog() {
  console.log("=================================================");
  console.log("STARTING GLOBAL CATALOG UNIQUE IMAGE ENFORCEMENT");
  console.log("=================================================");

  if (!fs.existsSync(PRODUCTS_FILE)) {
    throw new Error(`Cannot find products file at: ${PRODUCTS_FILE}`);
  }

  const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
  const products: Product[] = JSON.parse(raw);
  console.log(`Total Products in Catalog: ${products.length}`);

  // 1. Diversify Book titles in repetitive subcategories
  let kindleIdx = 0;
  let examIdx = 0;
  let indianIdx = 0;

  for (const p of products) {
    if (p.subcategory === "kindle-ebooks" && kindleIdx < KINDLE_EBOOKS_DATA.length) {
      const entry = KINDLE_EBOOKS_DATA[kindleIdx++];
      p.name = entry.name;
      p.productName = entry.name;
      p.brand = entry.brand;
      p.price = entry.price;
      p.originalPrice = Math.round(entry.price * 1.3);
      p.discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      p.slug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    } else if (p.subcategory === "exam-central" && examIdx < EXAM_CENTRAL_DATA.length) {
      const entry = EXAM_CENTRAL_DATA[examIdx++];
      p.name = entry.name;
      p.productName = entry.name;
      p.brand = entry.brand;
      p.price = entry.price;
      p.originalPrice = Math.round(entry.price * 1.25);
      p.discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      p.slug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    } else if (p.subcategory === "indian-language-books" && indianIdx < INDIAN_LITERATURE_DATA.length) {
      const entry = INDIAN_LITERATURE_DATA[indianIdx++];
      p.name = entry.name;
      p.productName = entry.name;
      p.brand = entry.brand;
      p.price = entry.price;
      p.originalPrice = Math.round(entry.price * 1.2);
      p.discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      p.slug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
  }

  // 1.5 Differentiate duplicate titles within the same subcategory
  const seenTitles = new Map<string, number>();
  for (const p of products) {
    const key = `${p.category}/${p.subcategory}/${p.name.toLowerCase()}`;
    const count = (seenTitles.get(key) || 0) + 1;
    seenTitles.set(key, count);
    if (count > 1) {
      const qualifiers = [
        "Pro Edition",
        "Series II",
        "Max Edition",
        "Ultra Series",
        "Classic Series",
        "Studio Edition",
        "Elite Series",
        "Special Edition 2026",
      ];
      const q = qualifiers[(count - 2) % qualifiers.length];
      p.name = `${p.name} (${q})`;
      p.productName = p.name;
      p.slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
  }

  // 2. Enforce Global Uniqueness across all 4,738 products
  const claimedPhotoKeys = new Set<string>();
  let realPhotosRetained = 0;
  let bespokeVisualsGenerated = 0;
  let bookVisualsGenerated = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const cat = (p.category || "").toLowerCase();
    const sub = (p.subcategory || "").toLowerCase();

    // Books and Ebooks REQUIRE distinct, title-matched book covers
    const isKindle = sub.includes("kindle");
    const rawPrimary = (p.images && p.images[0]) || p.thumbnail || "";
    const canonKey = getImageCanonicalKey(rawPrimary);

    let assignBespokeVisual = false;

    if (isKindle) {
      // Kindle ebooks must have distinct bespoke covers with title and author
      assignBespokeVisual = true;
      bookVisualsGenerated++;
    } else if (!rawPrimary || rawPrimary.startsWith("data:image/svg")) {
      assignBespokeVisual = true;
    } else if (!isImageSafe(rawPrimary) || !isImageCategoryCompatible(rawPrimary, p.category, p.subcategory)) {
      assignBespokeVisual = true;
    } else if (claimedPhotoKeys.has(canonKey)) {
      // Image was already claimed by another product!
      assignBespokeVisual = true;
    }

    if (assignBespokeVisual) {
      bespokeVisualsGenerated++;
      // Generate guaranteed unique 4-perspective gallery
      const gallery = generateProductGallery({
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        brand: p.brand,
      });

      p.thumbnail = gallery[0];
      p.images = gallery;
      p.productId = p.id;
      p.productName = p.name;
      claimedPhotoKeys.add(getImageCanonicalKey(gallery[0]));
    } else {
      // Retain the authentic real photography and claim it
      claimedPhotoKeys.add(canonKey);
      realPhotosRetained++;

      const gallery = buildSingleProductGallery(rawPrimary);
      p.thumbnail = rawPrimary;
      p.images = gallery;
      p.productId = p.id;
      p.productName = p.name;
    }

    // Ensure variant images are also aligned
    if (p.colors && p.colors.length > 0) {
      p.color = p.colors[0];
      p.variant = p.colors[0];
      const varImages: Record<string, string[]> = {};
      p.colors.forEach((col) => {
        varImages[col] = p.images;
      });
      p.variantImages = varImages;
    }
  }

  console.log(`Unique Real Photos Retained: ${realPhotosRetained}`);
  console.log(`Bespoke Product Visuals Generated: ${bespokeVisualsGenerated} (including ${bookVisualsGenerated} Kindle eBooks)`);

  // 3. Run validation check to guarantee 0 duplicates
  console.log("\nRunning validation check on transformed catalog...");
  const report = validateProductImages(products);

  console.log(`Validation Passed: ${report.valid ? "YES ✅" : "NO ❌"}`);
  console.log(`Total Products: ${report.totalProducts}`);
  console.log(`Unique Image Identities: ${report.uniqueBaseImagesCount}`);
  console.log(`Duplicate Count: ${report.duplicateCount}`);
  console.log(`Category Mismatches: ${report.categoryMismatchesCount}`);
  console.log(`Safety Violations: ${report.safetyViolationsCount}`);

  if (!report.valid) {
    console.error("Total issues count:", report.issues.length);
    console.error("Sample issue 1:", JSON.stringify(report.issues[0], null, 2));
    console.error("Sample issue 2:", JSON.stringify(report.issues[1], null, 2));
    throw new Error("Catalog validation failed: duplicate images or category mismatches remain!");
  }

  // 4. Save updated products.json
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  console.log(`\nSuccessfully saved 100% unique catalog to ${PRODUCTS_FILE}`);
  console.log("=================================================");
  console.log("GLOBAL CATALOG UNIQUE IMAGE ENFORCEMENT COMPLETED");
  console.log("=================================================");
}

enforceUniqueCatalog().catch((err) => {
  console.error("Enforcement failed:", err);
  process.exit(1);
});
