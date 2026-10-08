import fs from "fs";
import path from "path";
import { Product, ProductVariant } from "../models/Product.js";
import { CATEGORIES } from "../data/categories.js";
import { CATEGORY_BRANDS } from "../data/brands.js";

const DATA_DIR = fs.existsSync(path.resolve(process.cwd(), "data"))
  ? path.resolve(process.cwd(), "data")
  : path.resolve(process.cwd(), "server", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

// Curated verified, stable photography IDs per category
const PHOTO_SETS: Record<string, string[]> = {
  electronics: [
    "1593359677879-a4bb92f829d1",
    "1505740420928-5e560c06d30e",
    "1546435770-a3e426bf472b",
    "1516035069371-29a1b244cc32",
    "1508700115892-45ecd05ae2ad",
    "1608043152269-423dbba4e7e1",
    "1600080972464-8e5f35f63d08",
    "1526170375885-4d8ecf77b99f",
    "1550009158-9ebf69173e03",
    "1527864550417-7fd91fc51a46",
    "1572536147248-ac59a8abfa4b",
    "1545454675-3531b543be5d",
  ],
  mobiles: [
    "1511707171634-5f897ff02aa9",
    "1592750475338-74b7b21085ab",
    "1565849904461-04a58ad377e0",
    "1580910051074-3eb694886505",
    "1574944985070-8f3ebc6b79d2",
    "1601784551446-20c9e07cdbdb",
    "1585060544812-6b45742d762f",
    "1598327105666-5b89351aff97",
    "1512054502232-10a0a035d672",
    "1546868871-7041f2a55e12",
    "1533228876829-65c94e7b5025",
    "1567581935884-3349723552ca",
    "1605236453806-6ff36851218e",
    "1609692814858-f7cd2f0faf4f",
  ],
  laptops: [
    "1517336714731-489689fd1ca8",
    "1496181133206-80ce9b88a853",
    "1525547719571-a2d4ac8945e2",
    "1588872657578-7efd1f1555ed",
    "1603302576837-37561b2e2302",
    "1541807084-5c52b6b3adef",
    "1593642632823-8f785ba67e45",
    "1531297484001-80022131f5a1",
    "1587614382346-4ec70e388b28",
    "1526738549149-8e07eca6c147",
    "1498050108023-c5249f4df085",
    "1544716278-ca5e3f4abd8c",
  ],
  fashion: [
    "1489987707025-afc232f7ea0f",
    "1490578474895-699cd4e2cf59",
    "1483985988355-763728e1935b",
    "1521572267360-ee0c2909d518",
    "1542272604-780c96859503",
    "1515886657613-9f3515b0c78f",
    "1551028719-00167b16eac5",
    "1576995853123-5a10305d93c0",
    "1434389677669-e08b4cac3105",
    "1523381210434-271e8be1f52b",
    "1503342217505-b0a15ec3261c",
    "1485230895905-ec40ba36b9bc",
  ],
  shoes: [
    "1542291026-7eec264c27ff",
    "1525966226537-8848d7d4323a",
    "1595950653106-6c9ebd614d3a",
    "1608231387042-66d1773070a5",
    "1539185441755-769473a23570",
    "1560769629-975ec94e6a86",
    "1617606002779-51d866bdd1d1",
    "1533867617858-e7b97e060509",
    "1514989940748-18e47f7178a9",
    "1460353581641-37baddab0fa2",
    "1515955656352-a1fa3ffcd111",
    "1575537302964-96cd47c06b1b",
  ],
  "home-kitchen": [
    "1556911220-e15b29be8c8f",
    "1584269600464-37b1b58a9fe7",
    "1585515320310-259814833e62",
    "1586208958839-06c17cacdf08",
    "1590794056226-79ef3a8147e1",
    "1507089947368-19c1da9775ae",
    "1513694203232-719a280e022f",
    "1544816155-12df9643f363",
    "1610557892470-55d9e80c0bce",
    "1520986606214-8b456906c813",
    "1584990347449-74d75b3fdc7d",
    "1584990347461-a5907f16a086",
  ],
  beauty: [
    "1522335789203-aabd1fc54bc9",
    "1598440947619-2c35fc9aa908",
    "1596462502278-27bfdc403348",
    "1571781926291-c477ebfd024b",
    "1527799820374-dcf8d9d4a388",
    "1512496015851-a90fb38ba796",
    "1608248597359-2e0618037c76",
    "1535585209827-a15fcdbc4c2d",
    "1620916566398-39f1143ab7be",
    "1556228720-195a672e8a03",
    "1584990347468-b80c1084ea9e",
    "1515377905703-c4788e51af15",
  ],
  sports: [
    "1517838277536-f5f99be501cd",
    "1534438327276-14e5300c3a48",
    "1612872087720-bb876e2e67d1",
    "1579952363873-27f3bade9f55",
    "1546519638-68e109498ffc",
    "1506126613408-eca07ce68773",
    "1517649763962-0c623266ddc0",
    "1587280501635-68a0e82cd5ff",
    "1599058945522-28d584b6f0ff",
    "1584735935682-2f2b69dff9d2",
    "1519315901367-f34ff9154487",
    "1574629810360-7efbbe195018",
  ],
  books: [
    "1512820790803-83ca734da794",
    "1544947950-fa07a98d237f",
    "1532012164546-f43b7632dd04",
    "1543002588-bfa74002ed7e",
    "1495446815901-a7297e633e8d",
    "1589829085413-56de8ae18c73",
    "1516979187457-637abb4f9353",
    "1524995997946-a1c2e315a42f",
    "1497633762265-9d179a990aa6",
    "1476275466078-4007374efbbe",
    "1457369804613-52c61a468e7d",
    "1491841573634-28140fc7ced7",
  ],
  toys: [
    "1585366119957-e9730b6d0f60",
    "1515488042361-ee00e0ddd4e4",
    "1607604276583-eef5d076aa5f",
    "1566576912321-d58ddd7a6088",
    "1558060370-d644479cb6f7",
    "1596461404969-9ae70f2830c1",
    "1533230808558-a00d6765d70f",
    "1560963805-b50e4b64815f",
    "1508873696983-2df57036476b",
    "1587654780291-39c9404d746b",
    "1596461404969-9ae70f2830c1",
    "1533230808558-a00d6765d70f",
  ],
  accessories: [
    "1580910051074-3eb694886505",
    "1583863788434-e58a36330cf0",
    "1609592424109-dd9892f1b179",
    "1523275335684-37898b6baf30",
    "1553062407-98eeb64c6a62",
    "1590658268037-6bf12165a8df",
    "1622445268462-327fb1847145",
    "1572569511254-d8f925fe2cbb",
    "1618384887929-16ec33fab9ef",
    "1510519138115-0a9dc8049096",
    "1546868871-7041f2a55e12",
    "1616440347437-b1c73416efc2",
  ],
};

function buildImageUrl(photoId: string, width = 800, quality = 80): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&auto=format&fit=crop&q=${quality}`;
}

// Model & Product nomenclature templates for rich realism
const PRODUCT_TEMPLATES: Record<string, { models: string[]; adjectives: string[]; types: string[] }> = {
  electronics: {
    models: ["Bravia Master XR", "OLED Evo Pro", "Cinema Series Sound 700", "Alpha Mark IV", "QuietComfort Ultra", "Boombox Max 3", "C920 Pro HD", "Cinema Pro 8K", "Megaboom Wireless", "PartyBox 310"],
    adjectives: ["Cinematic 4K HDR", "Studio Wireless", "Noise Canceling", "Ultra-Bright Mini-LED", "High-Resolution Pro", "Deep Bass Surround", "Dolby Atmos Enabled", "Full-Frame Professional"],
    types: ["Smart TV", "Studio Headphones", "Wireless Earbuds", "Soundbar System", "DSLR Camera", "Home Theater Speaker", "Gaming Console Audio"],
  },
  mobiles: {
    models: ["Galaxy Ultra 5G", "iPhone Pro Max", "Nord Flagship", "Redmi Note Pro+", "Edge Fusion", "Phone (2a) Glyphed", "GT Neo Master", "V30 Pro Portrait", "Find X7 Ultra", "Pixel Pro AI"],
    adjectives: ["Dynamic AMOLED 120Hz", "Bionic Titanium", "SuperVOOC Fast-Charge", "Periscope Zoom", "HyperEngine Gaming", "Dual Sony Sensor", "Corning Gorilla Armor", "Pure Android Experience"],
    types: ["Flagship 5G Smartphone", "Premium Smartphone", "Camera Smartphone", "Foldable Smartphone", "Performance Smartphone"],
  },
  laptops: {
    models: ["XPS 15 InfinityEdge", "Spectre x360", "ThinkPad X1 Carbon", "ROG Strix SCAR", "Predator Helios", "MacBook Pro M3 Max", "Raider GE78 HX", "Surface Laptop Studio 2"],
    adjectives: ["Intel Core Ultra 9", "OLED Touch 120Hz", "GeForce RTX 4080", "Liquid Metal Cooled", "All-Day 22-Hour Battery", "CNC Aluminum Chassis", "Thunderbolt 4 Certified", "Dolby Vision Display"],
    types: ["Ultrabook Laptop", "Gaming Laptop", "Creator Workstation", "Business Laptop", "2-in-1 Touch Laptop"],
  },
  fashion: {
    models: ["501 Original Fit", "Tailored Oxford", "Classic Prime Linen", "Slim Formal Premier", "Elite Signature", "Urban Streetwear", "DryFit Athletic", "Essentials Everyday", "Heritage Vintage", "Tailored Chino"],
    adjectives: ["100% Breathable Cotton", "Heavyweight Japanese Selvedge", "Wrinkle-Resistant", "Easy Iron Stretch", "Pre-Shrunk Luxury", "Indigo Washed", "Modern Regular Fit", "Handcrafted Stitching"],
    types: ["Cotton Casual Shirt", "Formal Dress Shirt", "Selvedge Denim Jeans", "Designer Western Dress", "Ethnic Festive Kurta", "Lightweight Zipper Hoodie"],
  },
  shoes: {
    models: ["Air Zoom Pegasus", "Ultraboost Light", "Nitro Deviate Elite", "Nano X3 Training", "Go Walk Max Hyper", "Gel-Kayano 30", "Fresh Foam X 1080", "Classic Leather Oxford", "Streetwear Dunk Low", "Court Vision Pro"],
    adjectives: ["Responsive Carbon Plate", "Flyknit Breathable Upper", "Continental Rubber Grip", "Ortholite Memory Foam", "Rearfoot PureGEL Cushioning", "Full-Grain Italian Leather", "Shock Absorbing Midsole"],
    types: ["Running Shoes", "Athletic Training Shoes", "Streetwear Sneakers", "Formal Oxford Shoes", "Slip-on Walking Loafers", "Court Basketball Shoes"],
  },
  "home-kitchen": {
    models: ["Tri-Ply Stainless Steel Pro", "Deluxe Air Fryer XXL", "SilentPro Mixer Grinder", "SuperCook Hard Anodized", "Royal Chef Master", "Series 8 Induction Hub", "V15 Detect Absolute", "Smart Inverter Direct", "Nutri-Blend Pro", "PowerGrind Heavy Duty"],
    adjectives: ["Tri-Ply Heavy Gauge", "Rapid Air Circulation 360", "1000W Pure Copper Motor", "PFOA-Free Ceramic Non-Stick", "Laser Particle Detection", "Dishwasher Safe Components", "Precision Touch Control"],
    types: ["Non-Stick Cookware Set", "Digital Air Fryer", "High-Torque Mixer Grinder", "Espresso Coffee Machine", "Stainless Steel Pressure Cooker", "Cordless Vacuum Cleaner"],
  },
  beauty: {
    models: ["Hydra Genius Hyaluronic", "Fit Me Matte & Poreless", "Absolute Youth Glow", "Rich Deep Moisture", "Studio Fix Fluid SPF15", "Moisture Surge 100H", "Niacinamide 10% + Zinc 1%", "Soundarya Radiance", "Hydro Boost Water Gel", "Deep Pure Hydration"],
    adjectives: ["Dermatologist Formulated", "24-Hour Longwear Lightweight", "Clean Organic Cold-Pressed", "Oil-Free Non-Comedogenic", "Broad Spectrum UVA/UVB SPF 50", "Anti-Aging Peptide Infused"],
    types: ["Hydrating Face Serum", "Full-Coverage Liquid Foundation", "Daily Gel Moisturizer", "Restorative Night Cream", "Gentle Cleansing Foam", "Eau De Parfum Spray"],
  },
  sports: {
    models: ["Pro Hex Dumbbell Set", "Nanoflare 1000Z Graphite", "FIFA Pro Match Ball", "Kashmir Willow Power Drive", "Eco Cork Anti-Slip Mat", "Performance Compression Kit", "GripMax Boxing Gloves", "Aerobics Speed Jump Rope", "Pro Staff 97 Tennis Racket", "HydraChilly Insulated Flask"],
    adjectives: ["High-Modulus Carbon Graphite", "Thermal Bonded Seamless", "Cast Iron Rubber Encased", "Natural Sustainable Cork", "Moisture-Wicking Dri-FIT", "Grade 1 Selected Timber"],
    types: ["Hex Rubber Dumbbells", "Pro Badminton Racket", "Match Soccer Football", "Full-Size Cricket Bat", "High-Density Yoga Mat", "Athletic Training Tracksuit"],
  },
  books: {
    models: ["Chronicles of Innovation", "Atomic Mindsets & Growth", "The Intelligent Market Builder", "Designing Modern Data Systems", "Psychology of Everyday Choices", "The Clean Code Manifesto", "Deep Work Revolution", "Sapiens & Civilization", "Principles for Navigating Storms", "Zero to Infinite Scale"],
    adjectives: ["New York Times #1 Bestseller", "International Bestselling Edition", "Collector's Hardcover Edition", "Fully Illustrated & Annotated", "Comprehensive 2026 Revised Edition", "Award-Winning Masterwork"],
    types: ["Hardcover Literature Book", "Paperback Business Book", "Self-Help Growth Guide", "Technology Architecture Book", "Biographical Non-Fiction"],
  },
  toys: {
    models: ["Creator Expert Architecture", "Barbie Signature Dreamhouse", "Monopoly Mega Deluxe Edition", "Super RC Rock Crawler 4WD", "HydroStrike Motorized Blaster", "Star Wars Collector Figurine", "Mindstorms Robotics STEM Kit", "Play-Doh Super Creation Station", "Classic Wooden Train Set", "Codenames Strategy Board Game"],
    adjectives: ["1500+ Precision Interlocking Pieces", "High-Torque All-Terrain 2.4GHz", "Non-Toxic Child-Safe BPA Free", "Award-Winning STEM Learning", "Posable Hand-Painted Collector Grade", "Immersive Multiplayer Strategy"],
    types: ["Building Blocks Construction Set", "Remote Control RC Vehicle", "Educational STEM Robot Kit", "Family Strategy Board Game", "Action Figure Collectible", "Imaginative Playset"],
  },
  accessories: {
    models: ["MagSafe Tough Armor Case", "65W GaN Fast Dual Charger", "10,000mAh Magnetic Power Bank", "Braided Alpine Loop Strap", "Hydro-Repellent Laptop Sleeve", "9H Tempered Edge Glass", "7-in-1 USB-C Hub Adapter", "Silicone Protective Earbud Shell", "Shockproof Travel Organizer", "Nylon Braided USB4 Cable"],
    adjectives: ["Military-Grade Drop Certified 10ft", "Gallium Nitride (GaN) Ultra-Compact", "Qi2 15W Magnetic Wireless", "Aerospace Grade Titanium Buckle", "Scratch-Resistant Oleophobic", "10Gbps High-Speed Data 100W PD"],
    types: ["Impact Protective Phone Case", "GaN USB-C Wall Charger", "Wireless Magnetic Power Bank", "Smartwatch Replacement Strap", "Padded Laptop Travel Sleeve", "Multi-Port USB-C Hub Adapter"],
  },
};

// Category-specific specifications generator (honoring Section 11 of the master prompt)
function generateCategorySpecifications(category: string, brand: string, index: number): Record<string, string> {
  switch (category) {
    case "mobiles":
      return {
        "RAM": ["8 GB LPDDR5X", "12 GB LPDDR5X", "16 GB LPDDR5X"][index % 3],
        "Storage": ["128 GB UFS 4.0", "256 GB UFS 4.0", "512 GB UFS 4.0"][index % 3],
        "Processor": ["Snapdragon 8 Gen 3 (4nm)", "Apple A17 Pro (3nm)", "MediaTek Dimensity 9300", "Google Tensor G3"][index % 4],
        "Display": ["6.7-inch QHD+ Dynamic AMOLED 2X", "6.1-inch Super Retina XDR OLED", "6.78-inch LTPO 1.5K AMOLED"][index % 3],
        "Refresh Rate": "120Hz Adaptive (1-120Hz)",
        "Camera": ["200MP Main + 50MP Periscope + 12MP Ultra-Wide", "48MP Main + 12MP Telephoto + 12MP Ultra-Wide", "50MP Sony LYT-900 1-inch sensor"][index % 3],
        "Battery": ["5,000 mAh (45W Fast Charging)", "4,441 mAh (MagSafe 15W)", "5,400 mAh (100W SuperVOOC)"][index % 3],
        "Operating System": brand === "Apple" ? "iOS 17 (Upgradable)" : "Android 14 with Custom UI",
        "5G/4G": "Dual 5G Standalone (SA) with 14 Bands support",
        "Weight": ["187 g", "196 g", "221 g", "232 g"][index % 4],
      };
    case "laptops":
      return {
        "Processor": ["Intel Core Ultra 7 155H", "AMD Ryzen 9 7940HS", "Apple M3 Pro (12-Core)", "Intel Core i9-14900HX"][index % 4],
        "RAM": ["16 GB DDR5 5600MHz", "32 GB LPDDR5X 7500MHz", "64 GB DDR5 Dual-Channel"][index % 3],
        "Storage": ["512 GB PCIe 4.0 NVMe SSD", "1 TB PCIe 4.0 NVMe SSD", "2 TB High-Speed SSD"][index % 3],
        "GPU": brand === "Apple" ? "Apple 18-Core GPU" : ["NVIDIA GeForce RTX 4060 8GB GDDR6", "NVIDIA GeForce RTX 4070 8GB GDDR6", "Intel Arc Integrated Graphics"][index % 3],
        "Display": ["15.6-inch OLED 3.2K (3200x2000)", "16-inch IPS QHD+ (2560x1600)", "14-inch Liquid Retina XDR"][index % 3],
        "Refresh Rate": ["120Hz", "165Hz", "240Hz"][index % 3],
        "Operating System": brand === "Apple" ? "macOS Sonoma" : "Windows 11 Home / Pro",
        "Battery": ["75 Wh (up to 14 hours)", "90 Wh (up to 18 hours)", "99.9 Wh Rapid-Charge"][index % 3],
        "Weight": ["1.28 kg", "1.65 kg", "2.10 kg"][index % 3],
      };
    case "shoes":
      return {
        "Size": "UK/India 7 to 11 available",
        "Material": ["Engineered Primeknit & Mesh", "Full Grain Calfskin Leather", "Recycled High-Tensile Polyester"][index % 3],
        "Sole": ["Rubber Traction with Carbon Stabilizer", "Continental High-Grip Rubber", "Vibram MegaGrip Lugged Sole"][index % 3],
        "Fit": ["Regular Ergonomic Fit", "Wide-Toe Comfort Fit", "Snug Performance Athletic Fit"][index % 3],
        "Sport Type": ["Road Running & Marathon", "Cross-Training & Gym", "Lifestyle & Daily Walking", "Basketball & Court"][index % 4],
        "Closure": ["Lace-Up with Flywire Cables", "Slip-On Elasticated", "Quick-Lace Toggle System"][index % 3],
        "Color": ["Triple Black", "Cloud White", "Navy Blue", "Crimson Red"][index % 4],
      };
    case "fashion":
      return {
        "Size": "XS, S, M, L, XL, XXL",
        "Material": ["100% GOTS Certified Organic Cotton", "Heavyweight 13.5oz Denim", "Fine Pure Linen", "Poly-Viscose Stretch"][index % 4],
        "Fit": ["Slim Tailored Fit", "Relaxed Contemporary Fit", "Classic Regular Fit"][index % 3],
        "Pattern": ["Solid Dyed Clean", "Windowpane Checks", "Vintage Yarn Wash", "Subtle Herringbone"][index % 4],
        "Sleeve Type": ["Full Sleeve with Button Cuffs", "Half Sleeve Casual Ribbed", "Sleeveless Tailored"][index % 3],
        "Color": ["Deep Indigo", "Jet Black", "Crisp White", "Olive Green", "Charcoal Grey"][index % 5],
        "Care Instructions": "Machine wash cold inside-out, tumble dry low, warm iron if needed",
      };
    case "home-kitchen":
      return {
        "Material": ["Tri-Ply 304 Food Grade Stainless Steel", "Hard Anodized Aluminum 4.5mm", "Borosilicate Heat-Resistant Glass"][index % 3],
        "Dimensions": ["32 x 26 x 14 cm", "42 x 28 x 22 cm", "24 x 24 x 18 cm"][index % 3],
        "Capacity": ["2.5 Liters", "4.2 Liters", "6.5 Liters"][index % 3],
        "Power": ["750 Watts", "1000 Watts", "1500 Watts High-Efficiency"][index % 3],
        "Weight": ["2.1 kg", "3.8 kg", "5.4 kg"][index % 3],
        "Warranty": "2 Years On-Site Comprehensive Warranty",
      };
    case "beauty":
      return {
        "Skin/Hair Type": ["All Skin Types (Sensitive Friendly)", "Combination to Oily Skin", "Dry & Dehydrated Skin"][index % 3],
        "Quantity": ["30 ml Dropper Bottle", "50 ml Airless Pump Jar", "100 ml Tube"][index % 3],
        "Shade": ["Neutral Buff", "Warm Honey", "Porcelain Ivory", "Translucent"][index % 4],
        "Ingredients": "Hyaluronic Acid, Niacinamide, Pure Botanical Extracts, Vitamin C & E, Squalane",
        "Usage": "Apply 2-3 drops to cleansed skin morning and evening before creams",
        "Product Type": ["Hydrating Serum", "Mineral Sunscreen SPF50+", "Oil-Free Moisturizer", "Full Coverage Foundation"][index % 4],
      };
    case "sports":
      return {
        "Sport": ["Badminton", "Football / Soccer", "Strength & Gym", "Cricket", "Yoga & Mobility"][index % 5],
        "Material": ["High Modulus 40T Graphite", "Textured Thermo-Polyurethane", "Cast Iron Solid Core", "Premium English/Kashmir Willow"][index % 4],
        "Weight": ["83 g (4U)", "430 g (Size 5)", "10 kg Pair", "1.18 kg Bat"][index % 4],
        "Size": ["Standard Competition Spec", "Universal Olympic Standard", "Full Size Men's (Short Handle)"][index % 3],
        "Skill Level": ["Intermediate to Professional Tournament", "All Skill Levels", "Advanced Club Player"][index % 3],
      };
    case "books":
      return {
        "Author": ["James Clear & Colleague", "Morgan Housel & Experts", "Martin Fowler & Team", "Yuval Noah Harari", "Walter Isaacson"][index % 5],
        "Publisher": brand,
        "ISBN": `978-81-${Math.floor(1000000 + Math.random() * 9000000)}-${index % 10}`,
        "Language": "English",
        "Pages": `${280 + (index % 8) * 45} pages`,
        "Format": index % 2 === 0 ? "Hardcover (Gold Foil Embossed)" : "Premium Paperback Edition",
        "Publication Date": `2024-0${(index % 9) + 1}-15`,
        "Genre": ["Business & Investing", "Science & Technology", "Self-Help & Productivity", "Modern Literature"][index % 4],
      };
    case "toys":
      return {
        "Age Group": ["6 to 12 Years", "8 to 14 Years", "4+ Years Safe", "10+ Years Advanced"][index % 4],
        "Material": ["Non-Toxic High-Impact ABS Plastic", "Sustainable Natural Beech Wood", "Die-Cast Alloy Metal"][index % 3],
        "Dimensions": ["38 x 26 x 9 cm", "45 x 30 x 14 cm", "28 x 18 x 12 cm"][index % 3],
        "Battery Requirement": ["Rechargeable Lithium-Ion (USB-C Included)", "No Batteries Required", "3x AAA Alkaline"][index % 3],
        "Educational Category": ["Engineering & Spatial Architecture", "Logic & Strategic Thinking", "Creative Roleplay"][index % 3],
      };
    case "accessories":
      return {
        "Material": ["Shock-Absorbing TPU & Polycarbonate", "Braided Kevlar & TPE", "Aerospace Grade Aluminum Alloy"][index % 3],
        "Compatibility": ["iPhone 15/16 Series & Galaxy S24 Series", "Universal USB-C Power Delivery 3.0", "Apple Watch 40mm - 49mm"][index % 3],
        "Size": "Compact Travel Friendly Precision Form Factor",
        "Color": ["Matte Black", "Space Gray", "Midnight Blue", "Silver Titanium"][index % 4],
        "Features": "Drop Protection 12ft, Overheat & Surge Protection, Anti-Scratch Finish",
      };
    case "electronics":
    default:
      return {
        "Display/Audio": ["4K Ultra HD (3840 x 2160) Quantum OLED", "High-Resolution Studio Audio with Active ANC", "45MP BSI Stacked CMOS Sensor"][index % 3],
        "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, HDMI 2.1 eARC, Optical Out, USB-C PD",
        "Power Consumption": ["120 Watts Energy Star Certified", "30-Hour Battery Life with Fast Charge", "AC 100-240V Universal"][index % 3],
        "Dimensions": ["145 x 83 x 5.5 cm", "18 x 16 x 8 cm", "13.8 x 9.8 x 8.8 cm"][index % 3],
        "Weight": ["18.2 kg", "250 g", "650 g"][index % 3],
        "Warranty": "1 Year Standard Comprehensive Manufacturer Guarantee",
      };
  }
}

// Generate variants for each product
function generateVariants(
  category: string,
  baseSku: string,
  basePrice: number,
  originalPrice: number,
  colors: string[],
  images: string[]
): ProductVariant[] {
  const variants: ProductVariant[] = [];

  if (category === "shoes") {
    const shoeSizes = ["7", "8", "9", "10", "11"];
    colors.slice(0, 2).forEach((c, cIdx) => {
      shoeSizes.forEach((s) => {
        variants.push({
          id: `var-${baseSku.toLowerCase()}-${cIdx}-${s}`,
          sku: `${baseSku}-${c.slice(0, 3).toUpperCase()}-${s}`,
          color: c,
          size: s,
          price: basePrice,
          originalPrice,
          stock: 6 + Math.floor(Math.random() * 15),
          images,
          availability: "IN_STOCK",
        });
      });
    });
  } else if (category === "fashion") {
    const clothSizes = ["S", "M", "L", "XL"];
    colors.slice(0, 2).forEach((c, cIdx) => {
      clothSizes.forEach((s) => {
        variants.push({
          id: `var-${baseSku.toLowerCase()}-${cIdx}-${s}`,
          sku: `${baseSku}-${c.slice(0, 3).toUpperCase()}-${s}`,
          color: c,
          size: s,
          price: basePrice,
          originalPrice,
          stock: 8 + Math.floor(Math.random() * 20),
          images,
          availability: "IN_STOCK",
        });
      });
    });
  } else if (category === "mobiles") {
    const storageOptions = [
      { ram: "8GB", storage: "128GB", add: 0 },
      { ram: "12GB", storage: "256GB", add: 5000 },
      { ram: "12GB", storage: "512GB", add: 12000 },
    ];
    colors.slice(0, 2).forEach((c, cIdx) => {
      storageOptions.forEach((opt) => {
        variants.push({
          id: `var-${baseSku.toLowerCase()}-${cIdx}-${opt.storage}`,
          sku: `${baseSku}-${c.slice(0, 3).toUpperCase()}-${opt.storage}`,
          color: c,
          storage: opt.storage,
          ram: opt.ram,
          price: basePrice + opt.add,
          originalPrice: originalPrice + opt.add,
          stock: 5 + Math.floor(Math.random() * 12),
          images,
          availability: "IN_STOCK",
        });
      });
    });
  } else if (category === "laptops") {
    const specs = [
      { ram: "16GB", storage: "512GB SSD", add: 0 },
      { ram: "16GB", storage: "1TB SSD", add: 8000 },
      { ram: "32GB", storage: "1TB SSD", add: 18000 },
    ];
    colors.slice(0, 2).forEach((c, cIdx) => {
      specs.forEach((opt) => {
        variants.push({
          id: `var-${baseSku.toLowerCase()}-${cIdx}-${opt.ram}`,
          sku: `${baseSku}-${c.slice(0, 3).toUpperCase()}-${opt.ram}`,
          color: c,
          storage: opt.storage,
          ram: opt.ram,
          price: basePrice + opt.add,
          originalPrice: originalPrice + opt.add,
          stock: 4 + Math.floor(Math.random() * 10),
          images,
          availability: "IN_STOCK",
        });
      });
    });
  } else {
    // Other categories: variant by color or standard
    colors.slice(0, 3).forEach((c, cIdx) => {
      variants.push({
        id: `var-${baseSku.toLowerCase()}-${cIdx}`,
        sku: `${baseSku}-${c.slice(0, 3).toUpperCase()}`,
        color: c,
        price: basePrice,
        originalPrice,
        stock: 10 + Math.floor(Math.random() * 25),
        images,
        availability: "IN_STOCK",
      });
    });
  }

  return variants;
}

export function generate1100Catalog(): Product[] {
  const allProducts: Product[] = [];

  const categoryPriceBands: Record<string, { min: number; max: number }> = {
    electronics: { min: 2499, max: 129990 },
    mobiles: { min: 9999, max: 149999 },
    laptops: { min: 38990, max: 249990 },
    fashion: { min: 799, max: 7999 },
    shoes: { min: 1499, max: 16999 },
    "home-kitchen": { min: 999, max: 34990 },
    beauty: { min: 399, max: 6999 },
    sports: { min: 499, max: 18990 },
    books: { min: 299, max: 1999 },
    toys: { min: 499, max: 12990 },
    accessories: { min: 399, max: 4999 },
  };

  const categoryColors: Record<string, string[]> = {
    mobiles: ["Phantom Black", "Glacier Blue", "Titanium Gray", "Forest Green", "Pearl White"],
    laptops: ["Space Gray", "Platinum Silver", "Carbon Black", "Dark Ash"],
    shoes: ["Triple Black", "Cloud White", "Royal Blue", "Solar Red", "Core Grey"],
    fashion: ["Midnight Navy", "Jet Black", "Crisp White", "Burgundy Red", "Olive Green", "Beige"],
    electronics: ["Matte Black", "Gunmetal Gray", "Pure White", "Silver Steel"],
    "home-kitchen": ["Brushed Steel", "Glossy Black", "Fire Red", "Champagne Gold"],
    beauty: ["Natural Nude", "Coral Pink", "Classic Rose", "Amber Gold"],
    sports: ["Electric Blue", "Racer Red", "Stealth Black", "Neon Lime"],
    books: ["Standard Hardcover", "Library Paperback"],
    toys: ["Vibrant Multicolor", "Classic Yellow", "Cobalt Blue", "Hero Red"],
    accessories: ["Matte Black", "Crystal Clear", "Alpine Navy", "Charcoal Gray"],
  };

  // Generate 100 products for EACH of the 11 categories
  for (const cat of CATEGORIES) {
    const catSlug = cat.slug;
    const catBrands = CATEGORY_BRANDS[catSlug] || ["ShopSphere Select"];
    const photos = PHOTO_SETS[catSlug] || PHOTO_SETS["electronics"];
    const templates = PRODUCT_TEMPLATES[catSlug] || PRODUCT_TEMPLATES["electronics"];
    const priceBand = categoryPriceBands[catSlug] || { min: 999, max: 9999 };
    const availableColors = categoryColors[catSlug] || ["Default"];

    console.log(`[Catalog Generator] Building 100 products for category "${cat.name}" (${catSlug})...`);

    for (let i = 1; i <= 100; i++) {
      const brand = catBrands[(i - 1) % catBrands.length];
      const subcategory = cat.subcategories[(i - 1) % cat.subcategories.length];
      const modelName = templates.models[(i - 1) % templates.models.length];
      const adjective = templates.adjectives[(i + 2) % templates.adjectives.length];
      const pType = templates.types[(i + 1) % templates.types.length];

      // Formulate unique, descriptive, realistic product title
      const productName = `${brand} ${modelName} ${adjective} ${pType}`;
      const skuNumber = String(i).padStart(3, "0");
      const shortBrand = brand.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();
      const catCode = catSlug.slice(0, 4).toUpperCase();
      const sku = `${catCode}-${shortBrand}-${skuNumber}`;
      const id = `prod-${catSlug.slice(0, 4)}-${skuNumber}`;
      const slug = `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${modelName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;

      // Formulate 3-5 images for the product
      const primaryPhotoIdx = (i - 1) % photos.length;
      const secPhotoIdx = (i) % photos.length;
      const thirdPhotoIdx = (i + 1) % photos.length;
      const fourthPhotoIdx = (i + 2) % photos.length;

      const productImages = [
        buildImageUrl(photos[primaryPhotoIdx], 800, 80),
        buildImageUrl(photos[secPhotoIdx], 800, 80),
        buildImageUrl(photos[thirdPhotoIdx], 800, 80),
        buildImageUrl(photos[fourthPhotoIdx], 800, 80),
      ];

      // Realistic INR pricing
      const step = (priceBand.max - priceBand.min) / 100;
      const rawPrice = Math.round((priceBand.min + step * ((i * 7) % 100)) / 50) * 50;
      const discountPercent = 10 + ((i * 3) % 45); // between 10% and 54% discount
      const originalPrice = Math.round((rawPrice / (1 - discountPercent / 100)) / 50) * 50;
      const rating = Number((4.1 + ((i * 17) % 9) * 0.1).toFixed(1));
      const reviewsCount = 45 + ((i * 47) % 1250);
      const stock = 8 + ((i * 13) % 42);

      const productColors = availableColors.slice(0, 2 + (i % 3));
      const productSizes =
        catSlug === "shoes"
          ? ["7", "8", "9", "10", "11"]
          : catSlug === "fashion"
          ? ["S", "M", "L", "XL", "XXL"]
          : undefined;

      // Color to Image map
      const variantImages: Record<string, string[]> = {};
      productColors.forEach((color, cIdx) => {
        const cPhotoIdx = (primaryPhotoIdx + cIdx) % photos.length;
        const altPhotoIdx = (secPhotoIdx + cIdx) % photos.length;
        variantImages[color] = [
          buildImageUrl(photos[cPhotoIdx], 800, 80),
          buildImageUrl(photos[altPhotoIdx], 800, 80),
        ];
      });

      const specifications = generateCategorySpecifications(catSlug, brand, i);
      const variants = generateVariants(catSlug, sku, rawPrice, originalPrice, productColors, productImages);

      const product: Product = {
        id,
        productId: id,
        name: productName,
        productName: productName,
        slug,
        brand,
        category: catSlug,
        subcategory: subcategory.slug,
        productType: pType,
        sku,
        description: `The ${productName} delivers exceptional engineering and premium craftsmanship designed for everyday excellence. Featuring ${adjective.toLowerCase()} capabilities with genuine warranty from ${brand}, backed by ShopSphere's 7-day hassle-free replacement guarantee.`,
        shortDescription: `${adjective} ${pType} with verified brand authentic performance and quality.`,
        price: rawPrice,
        originalPrice,
        discountPercent,
        tax: 18,
        rating,
        reviewsCount,
        stock,
        thumbnail: productImages[0],
        images: productImages,
        variantImages,
        specifications,
        features: [
          `Engineered by ${brand} with precision durability and top-tier build quality`,
          `Features state-of-the-art ${adjective.toLowerCase()} components`,
          `Includes genuine official warranty and authentic serial verification`,
          `Ships securely packaged with verified fulfillment tracking`,
        ],
        colors: productColors,
        sizes: productSizes,
        variants,
        inventory: {
          stockQuantity: stock,
          reservedQuantity: 0,
          availableQuantity: stock,
          lowStockThreshold: 5,
          availabilityStatus: stock > 5 ? "IN_STOCK" : stock > 0 ? "LOW_STOCK" : "OUT_OF_STOCK",
        },
        tags: [brand.toLowerCase(), catSlug, subcategory.slug, pType.toLowerCase(), "authentic", "best-seller"],
        warranty: `1 Year Official ${brand} Manufacturer Warranty`,
        returnInfo: "7-day replacement or full refund on damaged/defective items",
        shippingInfo: "Free Express Courier Delivery in 2-3 business days",
        deliveryDays: 2 + (i % 2),
        freeDelivery: true,
        seller: "ShopSphere Official Retail",
        isFeatured: i <= 8,
        isBestSeller: i % 7 === 0,
        isDealOfDay: i % 11 === 0,
        dealBadge: i % 11 === 0 ? "Deal of the Day" : undefined,
        createdAt: new Date(Date.now() - (100 - i) * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        productStatus: "ACTIVE",
      };

      allProducts.push(product);
    }
  }

  return allProducts;
}

// Execute directly if run as CLI script
if (process.argv[1]?.includes("generate1100Products")) {
  console.log("Generating 1,100 high-fidelity e-commerce marketplace products...");
  const catalog = generate1100Catalog();
  console.log(`Generated total ${catalog.length} products.`);

  // Verify counts per category
  const counts: Record<string, number> = {};
  for (const p of catalog) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  console.log("Product count verification per category:");
  console.table(counts);

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(catalog, null, 2), "utf-8");
  console.log(`Wrote ${catalog.length} products to ${PRODUCTS_FILE}`);
}
