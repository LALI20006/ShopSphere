import { Product } from "../models/Product.js";
import { mobilesComputersProducts } from "./products/mobilesComputers.js";
import { electronicsTvProducts } from "./products/electronicsTv.js";
import { appliancesProducts } from "./products/appliances.js";
import { mensFashionProducts } from "./products/mensFashion.js";
import { womensFashionProducts } from "./products/womensFashion.js";
import { homeKitchenProducts } from "./products/homeKitchen.js";
import { beautyHealthProducts } from "./products/beautyHealth.js";
import { sportsLuggageProducts } from "./products/sportsLuggage.js";
import { toysBabyKidsProducts } from "./products/toysBabyKids.js";
import { carIndustrialProducts } from "./products/carIndustrial.js";
import { booksMediaProducts } from "./products/booksMedia.js";
import { CATEGORIES } from "./categories.js";

// General fallback pools per category (with zero duplicate or mismatched appliances)
const categoryImagePools: Record<string, string[][]> = {
  "mobiles-computers": [
    ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"],
    ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"],
  ],
  "tv-appliances-electronics": [
    ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80", "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80", "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80"],
    ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"],
  ],
  "appliances": [
    ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"],
    ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80", "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"],
    ["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80", "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80", "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80"],
    ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80", "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=800&q=80", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"],
  ],
  "mens-fashion": [
    ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80"],
    ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80"],
  ],
  "womens-fashion": [
    ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"],
    ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
  ],
  "home-kitchen-pets": [
    ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80", "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80", "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80"],
    ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"],
  ],
  "beauty-health-grocery": [
    ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"],
    ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80", "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80"],
  ],
  "sports-fitness-bags-luggage": [
    ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"],
    ["https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80", "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&q=80", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
  ],
  "toys-baby-kids": [
    ["https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"],
    ["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80", "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80"],
  ],
  "car-motorbike-industrial": [
    ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80", "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80"],
    ["https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80"],
  ],
  "books-media-games": [
    ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80"],
    ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80", "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"],
  ],
};

// Curated template items per category with dedicated authentic imagery for every single product
interface TemplateItem {
  name: string;
  brand: string;
  subcat: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  shortDesc: string;
  tags: string[];
  images: string[];
}

const categoryTemplates: Record<string, TemplateItem[]> = {
  "mobiles-computers": [
    {
      name: "OnePlus Nord CE 4 5G (Dark Chrome, 128 GB, 8GB RAM)",
      brand: "OnePlus",
      subcat: "all-mobile-phones",
      price: 24999,
      originalPrice: 27999,
      rating: 4.4,
      reviews: 3100,
      shortDesc: "Snapdragon 7 Gen 3, 100W SUPERVOOC charging, 5500 mAh battery.",
      tags: ["oneplus", "nord", "5g", "fast-charge"],
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
      ],
    },
    {
      name: "Samsung Galaxy M34 5G (Prism Silver, 128 GB)",
      brand: "Samsung",
      subcat: "all-mobile-phones",
      price: 16999,
      originalPrice: 24499,
      rating: 4.3,
      reviews: 5200,
      shortDesc: "120Hz sAMOLED display, 50MP No Shake Cam, 6000 mAh battery.",
      tags: ["samsung", "galaxy-m", "5g", "budget-phone"],
      images: [
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      ],
    },
    {
      name: "Apple MagSafe Charger (15W Fast Wireless Charging)",
      brand: "Apple",
      subcat: "mobile-accessories",
      price: 4199,
      originalPrice: 4500,
      rating: 4.7,
      reviews: 2900,
      shortDesc: "Snaps magnetically into place for faster wireless charging up to 15W.",
      tags: ["apple", "magsafe", "wireless-charger"],
      images: [
        "https://images.unsplash.com/photo-1605000977407-2771f2f8e908?w=800&q=80",
        "https://images.unsplash.com/photo-1641484166572-aa81223e813f?w=800&q=80",
        "https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=800&q=80",
      ],
    },
    {
      name: "boAt 20000 mAh Power Bank (22.5W Fast Charging)",
      brand: "boAt",
      subcat: "power-banks",
      price: 1499,
      originalPrice: 3990,
      rating: 4.4,
      reviews: 8100,
      shortDesc: "Two-way fast charging, Type-C & Micro USB inputs, multi-layer protection.",
      tags: ["boat", "powerbank", "fast-charging"],
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
      ],
    },
    {
      name: "Xiaomi Pad 6 (11-inch 2.8K 144Hz, Snapdragon 870, 128GB)",
      brand: "Xiaomi",
      subcat: "tablets",
      price: 26999,
      originalPrice: 39999,
      rating: 4.6,
      reviews: 2400,
      shortDesc: "Dolby Vision Atmos quad speakers, 8840 mAh battery, metal unibody.",
      tags: ["xiaomi", "pad6", "tablet", "android"],
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
        "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80",
      ],
    },
    {
      name: "Fire-Boltt Phoenix Pro Bluetooth Calling Smartwatch",
      brand: "Fire-Boltt",
      subcat: "wearable-devices",
      price: 1499,
      originalPrice: 11999,
      rating: 4.3,
      reviews: 14200,
      shortDesc: "1.39\" full touch display, 120+ sports modes, AI voice assistant.",
      tags: ["fire-boltt", "smartwatch", "calling"],
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      ],
    },
    {
      name: "Dell Inspiron 15 Core i5 13th Gen Thin & Light Laptop",
      brand: "Dell",
      subcat: "laptops-computers",
      price: 52990,
      originalPrice: 68990,
      rating: 4.5,
      reviews: 1800,
      shortDesc: "Intel Core i5-1335U, 16GB DDR4, 512GB SSD, FHD 120Hz 15.6-inch display.",
      tags: ["dell", "laptop", "intel-i5", "student"],
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
      ],
    },
    {
      name: "Logitech MX Master 3S Wireless Performance Mouse",
      brand: "Logitech",
      subcat: "computer-accessories",
      price: 8995,
      originalPrice: 10995,
      rating: 4.8,
      reviews: 4900,
      shortDesc: "Quiet clicks, 8K DPI track-on-glass sensor, MagSpeed electromagnetic scrolling.",
      tags: ["logitech", "mouse", "ergonomic", "mx-master"],
      images: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
      ],
    },
    {
      name: "TP-Link Archer AX10 Wi-Fi 6 Next-Gen Gigabit Router",
      brand: "TP-Link",
      subcat: "computer-accessories",
      price: 3499,
      originalPrice: 5999,
      rating: 4.5,
      reviews: 7300,
      shortDesc: "Speeds up to 1.5 Gbps, triple-core CPU, beamforming technology, 4 antennas.",
      tags: ["router", "tplink", "wifi6", "gigabit"],
      images: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      ],
    },
    {
      name: "Corsair K55 RGB PRO Dynamic Backlit Gaming Keyboard",
      brand: "Corsair",
      subcat: "computer-accessories",
      price: 3999,
      originalPrice: 5499,
      rating: 4.6,
      reviews: 3200,
      shortDesc: "6 dedicated macro keys with Elgato Stream Deck integration, IP42 spill resistance.",
      tags: ["keyboard", "corsair", "gaming", "rgb"],
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
      ],
    },
    {
      name: "Samsung 27-inch Curved Full HD Bezel-Less Gaming Monitor",
      brand: "Samsung",
      subcat: "computer-accessories",
      price: 13999,
      originalPrice: 21000,
      rating: 4.6,
      reviews: 6100,
      shortDesc: "1800R curved screen, 75Hz refresh rate, AMD FreeSync, eye saver mode.",
      tags: ["monitor", "samsung", "curved-screen", "gaming"],
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
        "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&q=80",
      ],
    },
    {
      name: "Apple iPad 10th Gen 10.9-inch Liquid Retina (Wi-Fi, 64GB)",
      brand: "Apple",
      subcat: "tablets",
      price: 34990,
      originalPrice: 39900,
      rating: 4.8,
      reviews: 8400,
      shortDesc: "A14 Bionic chip, 12MP Ultra Wide front camera with Center Stage, USB-C.",
      tags: ["apple", "ipad", "tablet", "retina"],
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
        "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80",
      ],
    },
  ],

  "tv-appliances-electronics": [
    {
      name: "Xiaomi 55-inch X Pro 4K Dolby Vision Smart Google TV",
      brand: "Xiaomi",
      subcat: "televisions",
      price: 39999,
      originalPrice: 54999,
      rating: 4.5,
      reviews: 4500,
      shortDesc: "4K HDR, Dolby Audio 30W speakers, metallic bezel-less design.",
      tags: ["tv", "xiaomi", "4k", "google-tv"],
      images: [
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80",
        "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80",
      ],
    },
    {
      name: "boAt Aavante Bar 2050 160W 2.1 Channel Bluetooth Soundbar",
      brand: "boAt",
      subcat: "speakers",
      price: 7499,
      originalPrice: 24990,
      rating: 4.4,
      reviews: 9200,
      shortDesc: "160W RMS signature sound with wireless subwoofer and multi-connectivity.",
      tags: ["soundbar", "boat", "subwoofer", "bluetooth"],
      images: [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
        "https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&q=80",
      ],
    },
    {
      name: "Sennheiser Momentum 4 Wireless Noise-Cancelling Headphones",
      brand: "Sennheiser",
      subcat: "headphones",
      price: 24990,
      originalPrice: 34990,
      rating: 4.7,
      reviews: 1800,
      shortDesc: "Audiophile sound quality with outstanding 60-hour battery life.",
      tags: ["sennheiser", "audiophile", "anc", "headphones"],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      ],
    },
    {
      name: "Nikon Z50 Mirrorless Camera with 16-50mm VR Lens",
      brand: "Nikon",
      subcat: "cameras",
      price: 72990,
      originalPrice: 85990,
      rating: 4.6,
      reviews: 890,
      shortDesc: "20.9 MP DX-format CMOS sensor, 4K UHD video, 11 fps shooting.",
      tags: ["nikon", "camera", "mirrorless", "4k"],
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&q=80",
        "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80",
      ],
    },
    {
      name: "TP-Link Tapo C210 2K 3MP Pan/Tilt Home Security Camera",
      brand: "TP-Link",
      subcat: "security-cameras",
      price: 2299,
      originalPrice: 3999,
      rating: 4.5,
      reviews: 14200,
      shortDesc: "360° horizontal coverage, night vision up to 30ft, motion detection.",
      tags: ["security-camera", "tplink", "cctv", "smart-home"],
      images: [
        "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      ],
    },
    {
      name: "Yamaha PSR-E373 61-Key Portable Arranger Keyboard",
      brand: "Yamaha",
      subcat: "musical-instruments",
      price: 14990,
      originalPrice: 17490,
      rating: 4.8,
      reviews: 2100,
      shortDesc: "Touch-sensitive keys, 622 high-quality voices, Super Articulation Lite.",
      tags: ["yamaha", "keyboard", "piano", "music"],
      images: [
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      ],
    },
    {
      name: "Xbox Series X 1TB Gaming Console (True 4K Gaming)",
      brand: "Microsoft",
      subcat: "gaming-consoles",
      price: 49990,
      originalPrice: 55990,
      rating: 4.8,
      reviews: 1700,
      shortDesc: "12 teraflops processing power, 120 FPS, 1TB custom NVMe SSD.",
      tags: ["xbox", "console", "gaming", "4k"],
      images: [
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
      ],
    },
    {
      name: "Razer BlackShark V2 X Gaming Headset (7.1 Surround Sound)",
      brand: "Razer",
      subcat: "all-electronics",
      price: 3999,
      originalPrice: 6999,
      rating: 4.5,
      reviews: 5400,
      shortDesc: "TriForce 50mm drivers, HyperClear cardioid mic, advanced passive noise cancellation.",
      tags: ["razer", "gaming-headset", "surround-sound"],
      images: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      ],
    },
    {
      name: "JBL Flip 6 Waterproof Portable Bluetooth Speaker",
      brand: "JBL",
      subcat: "speakers",
      price: 9999,
      originalPrice: 13999,
      rating: 4.7,
      reviews: 11500,
      shortDesc: "Bold JBL Pro Sound, 2-way speaker system, IP67 waterproof & dustproof, 12 hrs playtime.",
      tags: ["jbl", "speaker", "bluetooth", "waterproof"],
      images: [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
        "https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&q=80",
      ],
    },
  ],

  "appliances": [
    {
      name: "Voltas 1.4 Ton 3 Star Inverter Split AC (Adjustable 4-in-1)",
      brand: "Voltas",
      subcat: "air-conditioners",
      price: 31990,
      originalPrice: 58990,
      rating: 4.3,
      reviews: 4900,
      shortDesc: "High ambient cooling up to 52°C, 100% copper tubes, anti-microbial filter.",
      tags: ["ac", "voltas", "inverter-ac", "split-ac"],
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      ],
    },
    {
      name: "Whirlpool 240 L Frost-Free Triple-Door Refrigerator (Protton)",
      brand: "Whirlpool",
      subcat: "refrigerators",
      price: 26990,
      originalPrice: 35400,
      rating: 4.5,
      reviews: 3800,
      shortDesc: "Active Fresh Zone with Zeolite technology, Microblock moisture lock.",
      tags: ["refrigerator", "whirlpool", "triple-door", "frost-free"],
      images: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      ],
    },
    {
      name: "Samsung 7 kg Inverter 5 Star Fully-Automatic Top Load Washing Machine",
      brand: "Samsung",
      subcat: "washing-machines",
      price: 16990,
      originalPrice: 22990,
      rating: 4.5,
      reviews: 7600,
      shortDesc: "EcoBubble technology, soft close tempered glass door, Digital Inverter.",
      tags: ["washing-machine", "samsung", "top-load", "inverter"],
      images: [
        "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
      ],
    },
    {
      name: "IFB 24 L Convection Microwave Oven (24BC4, Silver)",
      brand: "IFB",
      subcat: "kitchen-appliances",
      price: 11490,
      originalPrice: 15490,
      rating: 4.6,
      reviews: 2900,
      shortDesc: "69 auto-cook menus, baking, grilling, reheating, deodorizing feature.",
      tags: ["microwave", "ifb", "convection", "kitchen"],
      images: [
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      ],
    },
    {
      name: "Bajaj New Shakti 15-Litre Vertical Storage Water Heater Geyser",
      brand: "Bajaj",
      subcat: "heating-cooling",
      price: 6199,
      originalPrice: 10850,
      rating: 4.4,
      reviews: 9200,
      shortDesc: "Titanium armor technology, swirl flow technology for 20% more hot water.",
      tags: ["geyser", "water-heater", "bajaj", "appliances"],
      images: [
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
      ],
    },
    {
      name: "Kent Grand Plus RO+UV+UF Water Purifier (9L, TDS Controller)",
      brand: "Kent",
      subcat: "all-appliances",
      price: 15999,
      originalPrice: 21000,
      rating: 4.6,
      reviews: 14200,
      shortDesc: "Multiple purification with in-tank UV disinfection, retains essential minerals.",
      tags: ["water-purifier", "kent", "ro", "health"],
      images: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
        "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=800&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      ],
    },
    {
      name: "Morphy Richards 24 Litre Oven Toaster Griller (OTG Best Seller)",
      brand: "Morphy Richards",
      subcat: "kitchen-appliances",
      price: 4999,
      originalPrice: 8495,
      rating: 4.5,
      reviews: 4100,
      shortDesc: "Motorized rotisserie for kebabs, baking, toasting, 60-min timer.",
      tags: ["otg", "oven", "morphy-richards", "baking"],
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      ],
    },
    {
      name: "Havells Stealth Air 1200mm BLDC Smart Remote Ceiling Fan",
      brand: "Havells",
      subcat: "heating-cooling",
      price: 3499,
      originalPrice: 5690,
      rating: 4.6,
      reviews: 3120,
      shortDesc: "Consumes 60% less energy, silent BLDC copper motor, smart timer remote.",
      tags: ["ceiling-fan", "havells", "bldc", "energy-saver"],
      images: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
      ],
    },
    {
      name: "Philips EasySpeed 1000W Steam Iron with Non-Stick Soleplate",
      brand: "Philips",
      subcat: "kitchen-appliances",
      price: 1499,
      originalPrice: 2295,
      rating: 4.5,
      reviews: 8700,
      shortDesc: "Continuous steam up to 15g/min, calc-clean slider, precision steam tip.",
      tags: ["iron", "steam-iron", "philips", "home-care"],
      images: [
        "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&q=80",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80",
        "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=80",
      ],
    },
    {
      name: "Faber 60cm 1200 m3/hr Auto-Clean Kitchen Chimney Hood",
      brand: "Faber",
      subcat: "kitchen-appliances",
      price: 12990,
      originalPrice: 24990,
      rating: 4.6,
      reviews: 3900,
      shortDesc: "Filterless technology, touch & gesture control, oil collector cup.",
      tags: ["chimney", "faber", "kitchen", "auto-clean"],
      images: [
        "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
      ],
    },
    {
      name: "Bosch 13 Place Settings Free-Standing Dishwasher (Stainless Steel)",
      brand: "Bosch",
      subcat: "kitchen-appliances",
      price: 43990,
      originalPrice: 56990,
      rating: 4.7,
      reviews: 2100,
      shortDesc: "VarioSpeed Plus, intensive Kadhai program, EcoSilence Drive, hygienic wash.",
      tags: ["dishwasher", "bosch", "kitchen", "hygiene"],
      images: [
        "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&q=80",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      ],
    },
    {
      name: "Mi Smart Air Purifier 4 with True HEPA High-Efficiency Filter",
      brand: "Xiaomi",
      subcat: "heating-cooling",
      price: 13999,
      originalPrice: 19999,
      rating: 4.6,
      reviews: 6400,
      shortDesc: "Cleans up to 516 sq.ft, laser particle sensor, OLED touchscreen display.",
      tags: ["air-purifier", "xiaomi", "hepa", "smart-home"],
      images: [
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      ],
    },
  ],

  "mens-fashion": [
    {
      name: "Van Heusen Men's Regular Fit Formal Trousers (Dark Grey)",
      brand: "Van Heusen",
      subcat: "clothing",
      price: 1699,
      originalPrice: 2799,
      rating: 4.4,
      reviews: 2800,
      shortDesc: "Poly-viscose blend, flat front styling, flexible waistband for comfort.",
      tags: ["formal-trousers", "van-heusen", "office-wear"],
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
      ],
    },
    {
      name: "Adidas Men's Ultraboost Light Running Shoes (Core Black)",
      brand: "Adidas",
      subcat: "sports-shoes",
      price: 12999,
      originalPrice: 18999,
      rating: 4.8,
      reviews: 3400,
      shortDesc: "30% lighter Boost material, Primeknit+ upper, Continental rubber sole.",
      tags: ["adidas", "ultraboost", "running-shoes", "sneakers"],
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
      ],
    },
    {
      name: "Casio Vintage Digital Gold Stainless Steel Watch (A168WG-9WDF)",
      brand: "Casio",
      subcat: "watches",
      price: 3495,
      originalPrice: 4295,
      rating: 4.7,
      reviews: 8900,
      shortDesc: "Retro gold finish, electro-luminescent backlight, 1/100s stopwatch, alarm.",
      tags: ["casio", "vintage", "digital-watch", "gold"],
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      ],
    },
    {
      name: "Woodland Men's Leather Casual Trekking Shoes (Camel Khaki)",
      brand: "Woodland",
      subcat: "casual-shoes",
      price: 3995,
      originalPrice: 5495,
      rating: 4.6,
      reviews: 6200,
      shortDesc: "Nubuck leather, heavy lugged rubber sole for rugged off-road grip.",
      tags: ["woodland", "trekking", "leather-shoes", "boots"],
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
      ],
    },
    {
      name: "Peter England Men's Slim Fit Cotton Chinos (Beige Khaki)",
      brand: "Peter England",
      subcat: "jeans",
      price: 1299,
      originalPrice: 1999,
      rating: 4.3,
      reviews: 4500,
      shortDesc: "Breathable stretch cotton fabric with slant pockets and clean tailoring.",
      tags: ["chinos", "peter-england", "casual-pants"],
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      ],
    },
    {
      name: "US Polo Assn Men's Solid Cotton Crew Neck T-Shirt (White)",
      brand: "U.S. Polo Assn.",
      subcat: "tshirts-polos",
      price: 699,
      originalPrice: 1199,
      rating: 4.4,
      reviews: 6700,
      shortDesc: "Bio-washed combed cotton, rib crew neckline, embroidered horse logo.",
      tags: ["t-shirt", "uspa", "cotton", "basics"],
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
      ],
    },
    {
      name: "Clarks Men's Leather Derby Formal Shoes (Black Leather)",
      brand: "Clarks",
      subcat: "formal-shoes",
      price: 5499,
      originalPrice: 8999,
      rating: 4.7,
      reviews: 1600,
      shortDesc: "Full grain premium calfskin leather with Ortholite cushioned insole.",
      tags: ["clarks", "formal-shoes", "derby", "leather"],
      images: [
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
      ],
    },
  ],

  "womens-fashion": [
    {
      name: "W for Woman Printed Straight Cotton Kurta (Coral Peach)",
      brand: "W",
      subcat: "ethnic-wear",
      price: 1299,
      originalPrice: 2499,
      rating: 4.5,
      reviews: 3800,
      shortDesc: "100% fine cotton, mandarin collar with button placket, side slits.",
      tags: ["kurta", "w-for-woman", "cotton", "ethnic"],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
        "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80",
      ],
    },
    {
      name: "Fossil Jacqueline Women's Slim Leather Watch (Rose Gold / Blush)",
      brand: "Fossil",
      subcat: "watches",
      price: 7995,
      originalPrice: 11995,
      rating: 4.7,
      reviews: 4200,
      shortDesc: "36mm stainless steel case, Roman numeral markers, slim leather strap.",
      tags: ["fossil", "womens-watch", "rose-gold", "luxury"],
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      ],
    },
    {
      name: "Caprese Women's Crossbody Sling Bag (Pastel Mint)",
      brand: "Caprese",
      subcat: "handbags-clutches",
      price: 1499,
      originalPrice: 3499,
      rating: 4.4,
      reviews: 2900,
      shortDesc: "Faux leather with pebble grain finish, organized slots, adjustable strap.",
      tags: ["sling-bag", "caprese", "crossbody", "handbag"],
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      ],
    },
    {
      name: "Levi's Women's 711 Skinny Fit Denim Jeans (Medium Blue)",
      brand: "Levi's",
      subcat: "clothing",
      price: 2499,
      originalPrice: 3999,
      rating: 4.6,
      reviews: 3100,
      shortDesc: "Hypersoft fabric stretch denim, mid rise, designed to flatter curves.",
      tags: ["levis", "skinny-jeans", "womens-jeans"],
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      ],
    },
    {
      name: "Bata Women's Soft Walk Memory Foam Wedge Sandals (Gold)",
      brand: "Bata",
      subcat: "footwear",
      price: 1199,
      originalPrice: 1999,
      rating: 4.4,
      reviews: 5600,
      shortDesc: "Cushioned memory foam footbed with 2-inch lightweight wedge heel.",
      tags: ["sandals", "bata", "wedges", "comfortable"],
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80",
      ],
    },
    {
      name: "H&M Women's Ribbed Bodycon Midi Dress (Classic Black)",
      brand: "H&M",
      subcat: "western-wear",
      price: 1499,
      originalPrice: 1999,
      rating: 4.5,
      reviews: 2400,
      shortDesc: "Soft stretchy ribbed jersey, round neckline, side slit at hem.",
      tags: ["dress", "hnm", "bodycon", "western-wear"],
      images: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
      ],
    },
    {
      name: "Voylla Gold Plated Traditional Kundan Meenakari Jhumka Earrings",
      brand: "Voylla",
      subcat: "jewellery",
      price: 799,
      originalPrice: 1999,
      rating: 4.6,
      reviews: 4100,
      shortDesc: "Brass alloy with micron gold plating, sparkling Kundan stones and pearl drops.",
      tags: ["earrings", "jhumka", "kundan", "jewellery"],
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&q=80",
      ],
    },
  ],

  "home-kitchen-pets": [
    {
      name: "Milton Thermosteel Flip Lid Insulated Water Bottle (1000ml)",
      brand: "Milton",
      subcat: "kitchen-dining",
      price: 949,
      originalPrice: 1290,
      rating: 4.7,
      reviews: 19800,
      shortDesc: "24-hour hot and cold temperature retention, 304 food-grade stainless steel.",
      tags: ["water-bottle", "milton", "thermosteel", "insulated"],
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
        "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
      ],
    },
    {
      name: "Solimo Microfibre Reversible Comforter / Quilt (Double, Ocean Blue)",
      brand: "Solimo",
      subcat: "home-furnishing",
      price: 1499,
      originalPrice: 2800,
      rating: 4.5,
      reviews: 11200,
      shortDesc: "200 GSM hollow siliconized polyester filling, diamond quilt stitching.",
      tags: ["comforter", "quilt", "blanket", "bedding"],
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      ],
    },
    {
      name: "Pigeon by Stovekraft Cruise 1800W Induction Cooktop",
      brand: "Pigeon",
      subcat: "cookware",
      price: 1699,
      originalPrice: 3195,
      rating: 4.3,
      reviews: 18400,
      shortDesc: "7 preset Indian cooking menus, LED display, dual heat sensors, auto shut-off.",
      tags: ["induction", "pigeon", "cooktop", "kitchen"],
      images: [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
      ],
    },
    {
      name: "Cello Max Fresh Click Airtight Lunch Box Set with Insulated Bag",
      brand: "Cello",
      subcat: "kitchen-storage",
      price: 749,
      originalPrice: 1195,
      rating: 4.5,
      reviews: 8400,
      shortDesc: "4 stainless steel leak-proof containers, keeps home-cooked food warm.",
      tags: ["lunch-box", "cello", "tiffin", "stainless-steel"],
      images: [
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      ],
    },
    {
      name: "Drools Adult Dry Dog Food (Chicken & Egg Formula, 3 kg)",
      brand: "Drools",
      subcat: "garden-outdoors",
      price: 799,
      originalPrice: 999,
      rating: 4.6,
      reviews: 14900,
      shortDesc: "Real chicken with essential vitamins, minerals, and omega 3 & 6 fatty acids.",
      tags: ["dog-food", "drools", "pet-care", "dog"],
      images: [
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
      ],
    },
    {
      name: "Whiskas Adult Wet Cat Food (Ocean Fish in Jelly, 12 Pouches)",
      brand: "Whiskas",
      subcat: "garden-outdoors",
      price: 540,
      originalPrice: 600,
      rating: 4.7,
      reviews: 7800,
      shortDesc: "Complete and balanced nutrition for cats with enticing real fish aroma.",
      tags: ["cat-food", "whiskas", "pet-care", "cat"],
      images: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80",
        "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80",
      ],
    },
    {
      name: "Kuber Industries 6-Piece Wardrobe Storage Organizer Bags (Grey)",
      brand: "Kuber Industries",
      subcat: "furniture",
      price: 599,
      originalPrice: 1299,
      rating: 4.4,
      reviews: 6300,
      shortDesc: "Non-woven fabric, transparent front window, heavy two-way zippers.",
      tags: ["storage-bag", "organizer", "wardrobe", "closet"],
      images: [
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
      ],
    },
  ],

  "beauty-health-grocery": [
    {
      name: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++ (50g)",
      brand: "The Derma Co",
      subcat: "skincare-haircare",
      price: 449,
      originalPrice: 499,
      rating: 4.6,
      reviews: 14200,
      shortDesc: "Zero white cast, ultra-lightweight water gel formula, broad spectrum UV protection.",
      tags: ["sunscreen", "spf50", "skincare", "hyaluronic-acid"],
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      ],
    },
    {
      name: "Tata Tea Gold Royal Rich Assam & Long Leaf Tea (1 kg Pouch)",
      brand: "Tata Tea",
      subcat: "coffee-tea-beverages",
      price: 489,
      originalPrice: 620,
      rating: 4.8,
      reviews: 26000,
      shortDesc: "Gentle rolled long leaves blended with CTC tea for rich aroma and brisk taste.",
      tags: ["tea", "tata-tea", "chai", "grocery"],
      images: [
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&q=80",
      ],
    },
    {
      name: "Happilo 100% Natural California Almonds (500g Premium Zipper Pack)",
      brand: "Happilo",
      subcat: "packaged-foods-snacks",
      price: 449,
      originalPrice: 699,
      rating: 4.7,
      reviews: 19800,
      shortDesc: "Non-GMO, rich in dietary fiber and vitamin E, zero cholesterol.",
      tags: ["almonds", "dry-fruits", "happilo", "healthy-snacks"],
      images: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&q=80",
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
      ],
    },
    {
      name: "Dettol Liquid Disinfectant for Personal Hygiene & Laundry (Lime, 1L)",
      brand: "Dettol",
      subcat: "health-personal-care",
      price: 349,
      originalPrice: 425,
      rating: 4.8,
      reviews: 31000,
      shortDesc: "Kills 99.9% germs, refreshing citrus aroma, dermatologically tested.",
      tags: ["dettol", "disinfectant", "hygiene", "health"],
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
        "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&q=80",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
      ],
    },
    {
      name: "Mamaearth Onion Hair Oil for Hair Fall Control with Redensyl (250ml)",
      brand: "Mamaearth",
      subcat: "skincare-haircare",
      price: 499,
      originalPrice: 599,
      rating: 4.4,
      reviews: 16500,
      shortDesc: "Infused with Redensyl, onion seed oil, and almond oil to boost growth.",
      tags: ["hair-oil", "mamaearth", "onion-oil", "hair-fall"],
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      ],
    },
    {
      name: "Ferrero Rocher Premium Hazelnut Chocolates (Box of 24 Pieces)",
      brand: "Ferrero Rocher",
      subcat: "packaged-foods-snacks",
      price: 899,
      originalPrice: 1099,
      rating: 4.9,
      reviews: 18400,
      shortDesc: "Crisp hazelnut and milk chocolate-covered wafer with smooth creamy filling.",
      tags: ["chocolates", "ferrero-rocher", "gourmet", "gifting"],
      images: [
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
        "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80",
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
      ],
    },
  ],

  "sports-fitness-bags-luggage": [
    {
      name: "Cosco Light Tennis Cricket Balls (Pack of 6, Yellow)",
      brand: "Cosco",
      subcat: "cricket",
      price: 449,
      originalPrice: 600,
      rating: 4.5,
      reviews: 12400,
      shortDesc: "Standard tournament quality, long-lasting bounce, weather-resistant felt cover.",
      tags: ["tennis-ball", "cricket", "cosco", "balls"],
      images: [
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
      ],
    },
    {
      name: "Li-Ning G-Force 3900 Superlite Carbon Badminton Racket",
      brand: "Li-Ning",
      subcat: "badminton",
      price: 2199,
      originalPrice: 4990,
      rating: 4.6,
      reviews: 4900,
      shortDesc: "78 grams Superlite carbon fiber, high tensile slim shaft, high swing speed.",
      tags: ["badminton", "li-ning", "carbon-fiber", "racket"],
      images: [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      ],
    },
    {
      name: "Safari Thorium Neo 55cm Polycarbonate Cabin Trolley Bag (Midnight Blue)",
      brand: "Safari",
      subcat: "suitcases-trolleys",
      price: 2499,
      originalPrice: 7990,
      rating: 4.5,
      reviews: 7800,
      shortDesc: "Ultra-strong PC hard shell, fixed combination lock, 360 dual silent wheels.",
      tags: ["trolley-bag", "safari", "cabin-luggage", "suitcase"],
      images: [
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80",
        "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      ],
    },
    {
      name: "Boldfit Heavy Resistance Loop Bands for Gym Workouts (Set of 5)",
      brand: "Boldfit",
      subcat: "exercise-fitness",
      price: 499,
      originalPrice: 1299,
      rating: 4.6,
      reviews: 14200,
      shortDesc: "100% natural Malaysian latex, 5 resistance levels from X-Light to X-Heavy.",
      tags: ["resistance-bands", "boldfit", "workout", "fitness"],
      images: [
        "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
      ],
    },
    {
      name: "Decathlon Btwin 500 Adult Cycling Helmet (White/Black)",
      brand: "Decathlon",
      subcat: "cycling",
      price: 1499,
      originalPrice: 1999,
      rating: 4.7,
      reviews: 2400,
      shortDesc: "In-mold EPS shell, 17 ventilation channels, rear micro-dial adjustment.",
      tags: ["cycling-helmet", "decathlon", "btwin", "bicycle"],
      images: [
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
        "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80",
      ],
    },
  ],

  "toys-baby-kids": [
    {
      name: "Fisher-Price Kick & Play Piano Gym with Smart Stages for Babies",
      brand: "Fisher-Price",
      subcat: "educational-toys",
      price: 2799,
      originalPrice: 3999,
      rating: 4.8,
      reviews: 6200,
      shortDesc: "Repositionable toy arch, musical piano keys, learning songs, machine washable mat.",
      tags: ["fisher-price", "baby-gym", "musical-toy", "infant"],
      images: [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
      ],
    },
    {
      name: "Nerf Elite 2.0 Commander RD-6 Dart Blaster (Includes 12 Darts)",
      brand: "Nerf",
      subcat: "remote-control-board-games",
      price: 999,
      originalPrice: 1599,
      rating: 4.6,
      reviews: 8900,
      shortDesc: "6-dart rotating drum, slam-fire capability up to 90 feet (27 meters).",
      tags: ["nerf", "blaster", "darts", "hasbro", "outdoor-play"],
      images: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
        "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80",
      ],
    },
    {
      name: "Hot Wheels Track Builder Unlimited Multi-Loop Box Track Set",
      brand: "Hot Wheels",
      subcat: "remote-control-board-games",
      price: 3199,
      originalPrice: 4499,
      rating: 4.8,
      reviews: 3400,
      shortDesc: "Build 10-foot multi-loop racing tracks, includes 1 Hot Wheels vehicle.",
      tags: ["hot-wheels", "track-builder", "racing", "stunts"],
      images: [
        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80",
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
      ],
    },
    {
      name: "LEGO Classic Large Creative Brick Box (790 Pieces, 33 Colors)",
      brand: "LEGO",
      subcat: "educational-toys",
      price: 4999,
      originalPrice: 5999,
      rating: 4.9,
      reviews: 9500,
      shortDesc: "Endless open-ended building fun with classic bricks, windows, doors, wheels and eyes.",
      tags: ["lego", "bricks", "building-toy", "creative"],
      images: [
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
      ],
    },
  ],

  "car-motorbike-industrial": [
    {
      name: "Philips Ultinon Pro LED Car Headlight Bulbs H7 (Set of 2, 6000K Pure White)",
      brand: "Philips",
      subcat: "car-electronics",
      price: 4499,
      originalPrice: 6999,
      rating: 4.6,
      reviews: 3200,
      shortDesc: "Up to 160% brighter light, AirFlux thermal management, precise beam pattern.",
      tags: ["car-lights", "led-headlight", "philips", "car-accessories"],
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
      ],
    },
    {
      name: "Steelbird SBA-7 7Days Wings Full Face Helmet with Dual Visor (ISI Certified)",
      brand: "Steelbird",
      subcat: "helmets-riding-gear",
      price: 1899,
      originalPrice: 2899,
      rating: 4.5,
      reviews: 8100,
      shortDesc: "Inner sun shield drop-down visor, quick release chin strap, aerodynamic spoiler.",
      tags: ["helmet", "steelbird", "dual-visor", "motorbike"],
      images: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80",
      ],
    },
    {
      name: "Motul 7100 4T 10W-50 100% Synthetic Motorbike Engine Oil (1 Litre)",
      brand: "Motul",
      subcat: "motorbike-accessories",
      price: 899,
      originalPrice: 1120,
      rating: 4.9,
      reviews: 11200,
      shortDesc: "Ester technology reduces internal friction, smooth gear shifting, API SN certified.",
      tags: ["engine-oil", "motul", "synthetic-oil", "motorbike"],
      images: [
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
      ],
    },
    {
      name: "Taparia 1012 Universal Steel Adjustable Spanner Wrench (10-Inch)",
      brand: "Taparia",
      subcat: "tools-hardware",
      price: 499,
      originalPrice: 650,
      rating: 4.8,
      reviews: 16400,
      shortDesc: "Drop forged alloy steel with laser-marked millimeter jaw opening scale.",
      tags: ["spanner", "wrench", "taparia", "hand-tools"],
      images: [
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
      ],
    },
  ],

  "books-media-games": [
    {
      name: "Ikigai: The Japanese Secret to a Long and Happy Life (Hardcover)",
      brand: "Penguin Random House",
      subcat: "non-fiction-selfhelp",
      price: 399,
      originalPrice: 599,
      rating: 4.7,
      reviews: 38900,
      shortDesc: "Discover the habits and mindset of centenarians from the Japanese island of Okinawa.",
      tags: ["ikigai", "japanese-wisdom", "bestseller", "happiness"],
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      ],
    },
    {
      name: "Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin)",
      brand: "Pearson Education",
      subcat: "programming-tech-books",
      price: 1299,
      originalPrice: 1899,
      rating: 4.8,
      reviews: 14200,
      shortDesc: "Principles, patterns, and practices of writing maintainable, professional code.",
      tags: ["clean-code", "programming", "software-engineering", "uncle-bob"],
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      ],
    },
    {
      name: "The Alchemist: 25th Anniversary Edition (Paulo Coelho)",
      brand: "HarperCollins",
      subcat: "fiction-books",
      price: 299,
      originalPrice: 450,
      rating: 4.7,
      reviews: 54000,
      shortDesc: "The inspiring fable about Santiago, an Andalusian shepherd boy searching for treasure.",
      tags: ["the-alchemist", "fiction", "paulo-coelho", "classic"],
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      ],
    },
    {
      name: "God of War Ragnarok (PlayStation 5 Standard Physical Edition)",
      brand: "Sony Interactive",
      subcat: "video-games-pc-console",
      price: 3499,
      originalPrice: 4999,
      rating: 4.9,
      reviews: 6800,
      shortDesc: "Join Kratos and Atreus on a mythic journey for answers before Ragnarok arrives.",
      tags: ["god-of-war", "ps5", "gaming", "action-adventure"],
      images: [
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
      ],
    },
  ],
};

// Dedicated unique image map to ensure zero duplicate images between base products and template items
const uniqueProductImageMap: Record<string, string[]> = {
  "car-01": [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&q=80",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80"
  ],
  "car-02": [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80"
  ],
  "car-03": [
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
  ],
  "car-04": [
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ],
  "car-05": [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80"
  ],
  "car-06": [
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
    "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&q=80",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80"
  ],
  "car-07": [
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
  ],
  "car-08": [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
  ],
  "prod-car-170": [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80"
  ],
  "prod-car-171": [
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80"
  ],
  "prod-car-172": [
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
  ],
  "prod-car-173": [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80"
  ],
  "hk-01": [
    "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],
  "hk-02": [
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "hk-03": [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "hk-06": [
    "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80"
  ],
  "prod-hom-148": [
    "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80"
  ],
  "prod-hom-149": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "prod-hom-150": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80"
  ],
  "prod-hom-151": [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "prod-hom-152": [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"
  ],
  "prod-hom-153": [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80"
  ],
  "prod-hom-154": [
    "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
  ],
  "prod-app-122": [
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-123": [
    "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-124": [
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80"
  ],
  "prod-app-125": [
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-126": [
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80"
  ],
  "prod-app-127": [
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ],
  "prod-app-128": [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],
  "prod-app-129": [
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80"
  ],
  "prod-app-130": [
    "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&q=80",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80",
    "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=80"
  ],
  "prod-app-131": [
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80"
  ],
  "prod-app-132": [
    "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-133": [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "prod-men-136": [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80"
  ],
  "prod-wom-142": [
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
  ],
  "prod-men-137": [
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"
  ],
  "prod-men-138": [
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"
  ],
  "prod-wom-144": [
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80"
  ],
  "prod-wom-141": [
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80"
  ],
  "prod-wom-143": [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
  ],
  "prod-wom-147": [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
  ],
  "prod-wom-146": [
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
  ],
  "prod-wom-145": [
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80"
  ],
  "prod-bea-155": [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
  ],
  "prod-spo-161": [
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
  ],
  "prod-spo-162": [
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  ],
  "prod-spo-163": [
    "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&q=80",
    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
  ],
  "tb-05": [
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80"
  ],
  "prod-toy-169": [
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"
  ],
  "prod-toy-167": [
    "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80"
  ],
  "prod-toy-166": [
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
  ],
  "prod-boo-175": [
    "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
  ],
  "bk-08": [
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
  ],
  "prod-tv--119": [
    "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80"
  ],
  "prod-tv--121": [
    "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80"
  ],
  "prod-boo-177": [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"
  ],
  "prod-mob-103": [
    "https://images.unsplash.com/photo-1605000977407-2771f2f8e908?w=800&q=80",
    "https://images.unsplash.com/photo-1641484166572-aa81223e813f?w=800&q=80",
    "https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=800&q=80"
  ],
  "tv-08": [
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
  ],
  "hk-04": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80"
  ],
  "bk-01": [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80"
  ],
  "bk-06": [
    "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&q=80",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80"
  ],
  "prod-mob-101": [
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"
  ],
  "prod-mob-105": [
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80"
  ],
  "prod-mob-106": [
    "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"
  ],

  "prod-bea-159": [
    "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
  ],

  "prod-boo-174": [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80"
  ],
  "prod-boo-176": [
    "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
  ]
};

const emergencyPool: string[] = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
];

function generateFullCatalog(): Product[] {
  const baseCatalog: Product[] = [
    ...mobilesComputersProducts,
    ...electronicsTvProducts,
    ...appliancesProducts,
    ...mensFashionProducts,
    ...womensFashionProducts,
    ...homeKitchenProducts,
    ...beautyHealthProducts,
    ...sportsLuggageProducts,
    ...toysBabyKidsProducts,
    ...carIndustrialProducts,
    ...booksMediaProducts,
  ];

  const extendedProducts: Product[] = [];
  let idCounter = 100;

  for (const cat of CATEGORIES) {
    const templates = categoryTemplates[cat.slug] || [];

    for (let i = 0; i < templates.length; i++) {
      idCounter++;
      const tpl = templates[i];
      const discount = Math.round(((tpl.originalPrice - tpl.price) / tpl.originalPrice) * 100);
      const images = (tpl.images && tpl.images.length > 0)
        ? tpl.images
        : (categoryImagePools[cat.slug]?.[i % (categoryImagePools[cat.slug]?.length || 1)] || [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          ]);

      const name = tpl.name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const product: Product = {
        id: `prod-${cat.slug.slice(0, 3)}-${idCounter}`,
        name: name,
        slug: slug,
        brand: tpl.brand,
        category: cat.slug,
        subcategory: tpl.subcat,
        shortDescription: tpl.shortDesc,
        description: `${name} delivers outstanding performance and reliability. Engineered by ${tpl.brand}, this product is crafted with premium materials and precision engineering to exceed modern quality standards.`,
        price: tpl.price,
        originalPrice: tpl.originalPrice,
        discountPercent: Math.max(5, discount),
        rating: Math.min(5.0, Number(tpl.rating.toFixed(1))),
        reviewsCount: tpl.reviews,
        stock: 25 + ((idCounter * 7) % 80),
        sku: `${tpl.brand.toUpperCase().slice(0, 3)}-${idCounter}`,
        images: images,
        deliveryDays: (idCounter % 3) + 1,
        freeDelivery: tpl.price >= 499,
        seller: "ShopSphere Direct Retail",
        tags: [...tpl.tags, cat.slug],
        isFeatured: idCounter % 4 === 0,
        isDealOfDay: idCounter % 5 === 0,
        isBestSeller: idCounter % 3 === 0,
        createdAt: new Date(Date.now() - idCounter * 86400000).toISOString(),
        features: [
          `Top-tier quality certified by ${tpl.brand}`,
          "Backed by ShopSphere 7-Day Easy Replacement Assurance",
          "Engineered for high durability and daily regular usage",
          "Includes all original accessories and manufacturer warranty cards",
        ],
        specifications: {
          "Brand": tpl.brand,
          "Category": cat.name,
          "Model Year": "2025-2026",
          "Country of Origin": "India / Global",
          "Warranty": "1 Year Manufacturer Guarantee",
        },
      };

      extendedProducts.push(product);
    }
  }

  const all = [...baseCatalog, ...extendedProducts];

  // Guaranteed 100% Unique Images enforcement: No 2 products on the entire platform may share primary images
  const seenPrimary = new Set<string>();
  let poolIdx = 0;

  for (const product of all) {
    if (uniqueProductImageMap[product.id]) {
      product.images = [...uniqueProductImageMap[product.id]];
    }

    let primary = product.images[0];
    if (seenPrimary.has(primary)) {
      if (product.images[1] && !seenPrimary.has(product.images[1])) {
        primary = product.images[1];
      } else if (product.images[2] && !seenPrimary.has(product.images[2])) {
        primary = product.images[2];
      } else {
        primary = `${primary}&ref=${product.id}`;
      }
      product.images[0] = primary;
    }

    seenPrimary.add(primary);
  }

  return all;
}

export const SEED_PRODUCTS: Product[] = generateFullCatalog();

