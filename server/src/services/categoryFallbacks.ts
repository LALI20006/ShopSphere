/**
 * Category-specific SVG fallback placeholders for the backend server.
 * Ensures consistent SVG fallback resolution across API responses and catalog seeding.
 */

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

const BASE_WIDTH = 600;
const BASE_HEIGHT = 600;

function createSvgTemplate(
  accentColor: string,
  gradientStart: string,
  gradientEnd: string,
  title: string,
  subtitle: string,
  iconContent: string
): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BASE_WIDTH} ${BASE_HEIGHT}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientStart}"/>
      <stop offset="100%" stop-color="${gradientEnd}"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="${accentColor}" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  
  <g filter="url(#cardShadow)">
    <rect x="75" y="60" width="450" height="400" rx="36" fill="#ffffff" opacity="0.95"/>
    <rect x="75" y="60" width="450" height="400" rx="36" fill="none" stroke="${accentColor}" stroke-opacity="0.18" stroke-width="2"/>
  </g>

  <g transform="translate(180, 110)">
    ${iconContent}
  </g>

  <g text-anchor="middle">
    <text x="300" y="395" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#0f172a" letter-spacing="0.5">
      ${title}
    </text>
    <text x="300" y="425" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="0.2">
      ${subtitle}
    </text>
  </g>

  <g transform="translate(210, 500)">
    <rect width="180" height="34" rx="17" fill="#0f172a" opacity="0.9"/>
    <circle cx="24" cy="17" r="5" fill="${accentColor}"/>
    <text x="96" y="22" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#ffffff" letter-spacing="1">
      SHOPSPHERE VERIFIED
    </text>
  </g>
</svg>
  `;
}

export const CATEGORY_FALLBACK_URLS = {
  mobile: encodeSvg(
    createSvgTemplate(
      "#3b82f6",
      "#f0f7ff",
      "#e0effe",
      "Smartphone",
      "Official Product Photography",
      `<rect x="70" y="20" width="100" height="200" rx="20" fill="#0f172a"/>
       <rect x="74" y="26" width="92" height="188" rx="16" fill="#1e293b"/>
       <rect x="78" y="32" width="84" height="176" rx="12" fill="#38bdf8" opacity="0.25"/>
       <rect x="106" y="36" width="28" height="7" rx="3.5" fill="#0f172a"/>
       <circle cx="120" cy="90" r="16" fill="#38bdf8" opacity="0.3"/>
       <circle cx="120" cy="90" r="8" fill="#0284c7"/>`
    )
  ),
  laptop: encodeSvg(
    createSvgTemplate(
      "#6366f1",
      "#f5f3ff",
      "#ede9fe",
      "Laptop & Computing",
      "High-Performance System",
      `<rect x="40" y="40" width="160" height="110" rx="10" fill="#0f172a"/>
       <rect x="46" y="46" width="148" height="98" rx="6" fill="#6366f1" opacity="0.2"/>
       <circle cx="120" cy="95" r="16" fill="#818cf8" opacity="0.5"/>
       <path d="M15 160 L225 160 L210 178 L30 178 Z" fill="#334155"/>
       <rect x="100" y="162" width="40" height="5" rx="2" fill="#64748b"/>`
    )
  ),
  headphones: encodeSvg(
    createSvgTemplate(
      "#8b5cf6",
      "#faf5ff",
      "#f3e8ff",
      "Headphones & Audio",
      "Premium Wireless Sound",
      `<path d="M50 140 A70 70 0 0 1 190 140" fill="none" stroke="#0f172a" stroke-width="14" stroke-linecap="round"/>
       <rect x="36" y="110" width="28" height="65" rx="14" fill="#8b5cf6"/>
       <rect x="56" y="118" width="10" height="49" rx="5" fill="#4c1d95"/>
       <rect x="176" y="110" width="28" height="65" rx="14" fill="#8b5cf6"/>
       <rect x="174" y="118" width="10" height="49" rx="5" fill="#4c1d95"/>
       <circle cx="120" cy="140" r="18" fill="#a78bfa" opacity="0.35"/>`
    )
  ),
  fashion: encodeSvg(
    createSvgTemplate(
      "#ec4899",
      "#fdf2f8",
      "#fce7f3",
      "Fashion & Apparel",
      "Curated Style Collection",
      `<path d="M85 45 L110 65 L130 65 L155 45 L190 70 L170 100 L155 90 L155 185 L85 185 L85 90 L70 100 L50 70 Z" fill="#ec4899" opacity="0.9"/>
       <path d="M110 65 Q120 85 130 65" fill="none" stroke="#be185d" stroke-width="4"/>
       <line x1="120" y1="90" x2="120" y2="175" stroke="#ffffff" stroke-width="3" stroke-dasharray="6,4" opacity="0.7"/>`
    )
  ),
  shoes: encodeSvg(
    createSvgTemplate(
      "#f97316",
      "#fff7ed",
      "#ffedd5",
      "Shoes & Footwear",
      "Athletic & Casual Shoes",
      `<path d="M40 145 C40 115 80 105 105 105 C120 105 140 85 165 85 C185 85 195 105 205 130 C210 145 205 160 195 160 L45 160 C40 160 40 150 40 145 Z" fill="#ea580c"/>
       <rect x="35" y="160" width="175" height="18" rx="8" fill="#0f172a"/>
       <path d="M130 100 L145 125 L175 110" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
       <line x1="110" y1="115" x2="125" y2="105" stroke="#fed7aa" stroke-width="3"/>
       <line x1="120" y1="125" x2="135" y2="115" stroke="#fed7aa" stroke-width="3"/>`
    )
  ),
  home: encodeSvg(
    createSvgTemplate(
      "#14b8a6",
      "#f0fdfa",
      "#ccfbf1",
      "Home & Furniture",
      "Comfort & Interior Living",
      `<rect x="50" y="100" width="140" height="60" rx="14" fill="#0d9488"/>
       <rect x="65" y="60" width="110" height="55" rx="12" fill="#14b8a6"/>
       <rect x="40" y="110" width="25" height="50" rx="10" fill="#115e59"/>
       <rect x="175" y="110" width="25" height="50" rx="10" fill="#115e59"/>
       <line x1="60" y1="160" x2="50" y2="185" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
       <line x1="180" y1="160" x2="190" y2="185" stroke="#334155" stroke-width="6" stroke-linecap="round"/>`
    )
  ),
  kitchen: encodeSvg(
    createSvgTemplate(
      "#eab308",
      "#fefce8",
      "#fef08a",
      "Kitchen & Dining",
      "Cookware & Home Appliances",
      `<ellipse cx="110" cy="130" rx="65" ry="35" fill="#ca8a04"/>
       <rect x="45" y="115" width="130" height="45" rx="10" fill="#eab308"/>
       <ellipse cx="110" cy="115" rx="65" ry="25" fill="#fef08a" opacity="0.6"/>
       <rect x="170" y="125" width="55" height="14" rx="7" fill="#0f172a"/>
       <path d="M90 85 Q95 70 90 55" fill="none" stroke="#ca8a04" stroke-width="3" stroke-linecap="round"/>
       <path d="M110 80 Q115 65 110 50" fill="none" stroke="#ca8a04" stroke-width="3" stroke-linecap="round"/>
       <path d="M130 85 Q135 70 130 55" fill="none" stroke="#ca8a04" stroke-width="3" stroke-linecap="round"/>`
    )
  ),
  beauty: encodeSvg(
    createSvgTemplate(
      "#d946ef",
      "#fdf4ff",
      "#fae8ff",
      "Beauty & Personal Care",
      "Dermatologist & Salon Tested",
      `<rect x="75" y="75" width="50" height="105" rx="14" fill="#c026d3"/>
       <rect x="87" y="55" width="26" height="20" rx="4" fill="#e879f9"/>
       <path d="M100 55 L100 40 L120 40" fill="none" stroke="#a21caf" stroke-width="5" stroke-linecap="round"/>
       <rect x="135" y="115" width="60" height="50" rx="8" fill="#f472b6"/>
       <rect x="130" y="105" width="70" height="14" rx="5" fill="#db2777"/>`
    )
  ),
  sports: encodeSvg(
    createSvgTemplate(
      "#10b981",
      "#ecfdf5",
      "#d1fae5",
      "Sports & Fitness",
      "Athletic & Performance Gear",
      `<rect x="45" y="85" width="25" height="70" rx="8" fill="#059669"/>
       <rect x="70" y="95" width="12" height="50" rx="4" fill="#047857"/>
       <rect x="82" y="112" width="76" height="16" rx="4" fill="#334155"/>
       <rect x="158" y="95" width="12" height="50" rx="4" fill="#047857"/>
       <rect x="170" y="85" width="25" height="70" rx="8" fill="#059669"/>`
    )
  ),
  books: encodeSvg(
    createSvgTemplate(
      "#0284c7",
      "#f0f9ff",
      "#e0f2fe",
      "Books & Literature",
      "Bestseller Paperback & Hardcover",
      `<rect x="70" y="45" width="100" height="145" rx="8" fill="#0369a1"/>
       <rect x="76" y="50" width="94" height="135" rx="4" fill="#ffffff"/>
       <rect x="80" y="55" width="86" height="125" rx="4" fill="#0284c7"/>
       <rect x="90" y="70" width="66" height="8" rx="3" fill="#bae6fd"/>
       <rect x="90" y="84" width="46" height="6" rx="3" fill="#7dd3fc"/>
       <path d="M120 50 L120 100 L127 90 L134 100 L134 50 Z" fill="#e11d48"/>`
    )
  ),
  car: encodeSvg(
    createSvgTemplate(
      "#ea580c",
      "#fff7ed",
      "#ffedd5",
      "Automotive Accessories",
      "Vehicle Care & Rider Protection",
      `<path d="M60 130 C60 80 100 50 145 50 C180 50 200 80 200 120 C200 150 175 165 140 165 L95 165 C75 165 60 150 60 130 Z" fill="#c2410c"/>
       <path d="M110 90 L185 90 C180 125 155 130 115 130 Z" fill="#0f172a"/>
       <path d="M85 75 C110 60 145 60 165 70" fill="none" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>`
    )
  ),
  toys: encodeSvg(
    createSvgTemplate(
      "#8b5cf6",
      "#faf5ff",
      "#ede9fe",
      "Toys & Kids",
      "Educational & Fun Play",
      `<rect x="60" y="105" width="55" height="55" rx="10" fill="#f59e0b"/>
       <text x="87" y="142" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">A</text>
       <rect x="125" y="105" width="55" height="55" rx="10" fill="#ec4899"/>
       <text x="152" y="142" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">B</text>
       <rect x="92" y="45" width="55" height="55" rx="10" fill="#3b82f6"/>
       <text x="119" y="82" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">1</text>`
    )
  ),
  generic: encodeSvg(
    createSvgTemplate(
      "#4f46e5",
      "#eef2ff",
      "#e0e7ff",
      "ShopSphere Product",
      "Genuine & Quality Verified",
      `<rect x="65" y="60" width="110" height="110" rx="20" fill="#4f46e5"/>
       <path d="M120 75 L155 95 L155 135 L120 155 L85 135 L85 95 Z" fill="none" stroke="#ffffff" stroke-width="6"/>
       <line x1="120" y1="75" x2="120" y2="155" stroke="#ffffff" stroke-width="4" opacity="0.6"/>
       <line x1="120" y1="115" x2="155" y2="95" stroke="#ffffff" stroke-width="4" opacity="0.6"/>
       <line x1="120" y1="115" x2="85" y2="95" stroke="#ffffff" stroke-width="4" opacity="0.6"/>`
    )
  ),
};

export function getCategoryFallbackImage(
  category?: string,
  subcategory?: string,
  productName?: string
): string {
  const combined = `${category || ""} ${subcategory || ""} ${productName || ""}`.toLowerCase();

  if (
    combined.includes("headphone") ||
    combined.includes("earphone") ||
    combined.includes("earbud") ||
    combined.includes("headset") ||
    combined.includes("airpod")
  ) {
    return CATEGORY_FALLBACK_URLS.headphones;
  }

  if (
    combined.includes("shoe") ||
    combined.includes("sneaker") ||
    combined.includes("boot") ||
    combined.includes("footwear") ||
    combined.includes("sandal") ||
    combined.includes("loafer")
  ) {
    return CATEGORY_FALLBACK_URLS.shoes;
  }

  if (
    combined.includes("laptop") ||
    combined.includes("macbook") ||
    combined.includes("desktop") ||
    combined.includes("monitor") ||
    combined.includes("computer")
  ) {
    return CATEGORY_FALLBACK_URLS.laptop;
  }

  if (
    combined.includes("phone") ||
    combined.includes("smartphone") ||
    combined.includes("iphone") ||
    combined.includes("mobile") ||
    combined.includes("android") ||
    combined.includes("tablet") ||
    combined.includes("ipad")
  ) {
    return CATEGORY_FALLBACK_URLS.mobile;
  }

  if (
    combined.includes("book") ||
    combined.includes("novel") ||
    combined.includes("fiction") ||
    combined.includes("biography") ||
    combined.includes("textbook") ||
    combined.includes("literature")
  ) {
    return CATEGORY_FALLBACK_URLS.books;
  }

  if (
    combined.includes("refrigerator") ||
    combined.includes("kitchen") ||
    combined.includes("cookware") ||
    combined.includes("mixer") ||
    combined.includes("appliance") ||
    combined.includes("microwave") ||
    combined.includes("dining")
  ) {
    return CATEGORY_FALLBACK_URLS.kitchen;
  }

  if (
    combined.includes("cloth") ||
    combined.includes("shirt") ||
    combined.includes("dress") ||
    combined.includes("t-shirt") ||
    combined.includes("jean") ||
    combined.includes("fashion") ||
    combined.includes("kurti") ||
    combined.includes("trousers") ||
    combined.includes("handbag") ||
    combined.includes("wallet") ||
    combined.includes("saree")
  ) {
    return CATEGORY_FALLBACK_URLS.fashion;
  }

  if (
    combined.includes("beauty") ||
    combined.includes("skincare") ||
    combined.includes("makeup") ||
    combined.includes("serum") ||
    combined.includes("shampoo") ||
    combined.includes("perfume")
  ) {
    return CATEGORY_FALLBACK_URLS.beauty;
  }

  if (
    combined.includes("cricket") ||
    combined.includes("sport") ||
    combined.includes("gym") ||
    combined.includes("fitness") ||
    combined.includes("badminton") ||
    combined.includes("football") ||
    combined.includes("workout")
  ) {
    return CATEGORY_FALLBACK_URLS.sports;
  }

  if (
    combined.includes("car") ||
    combined.includes("bike") ||
    combined.includes("helmet") ||
    combined.includes("automotive") ||
    combined.includes("motorbike")
  ) {
    return CATEGORY_FALLBACK_URLS.car;
  }

  if (
    combined.includes("toy") ||
    combined.includes("kid") ||
    combined.includes("baby") ||
    combined.includes("diaper") ||
    combined.includes("game")
  ) {
    return CATEGORY_FALLBACK_URLS.toys;
  }

  if (
    combined.includes("home") ||
    combined.includes("furniture") ||
    combined.includes("decor") ||
    combined.includes("bedding")
  ) {
    return CATEGORY_FALLBACK_URLS.home;
  }

  const catSlug = (category || "").toLowerCase();
  if (catSlug.includes("mobi") || catSlug.includes("comp")) return CATEGORY_FALLBACK_URLS.laptop;
  if (catSlug.includes("elec") || catSlug.includes("tv")) return CATEGORY_FALLBACK_URLS.headphones;
  if (catSlug.includes("fashion")) return CATEGORY_FALLBACK_URLS.fashion;
  if (catSlug.includes("home") || catSlug.includes("kitchen")) return CATEGORY_FALLBACK_URLS.kitchen;
  if (catSlug.includes("beauty")) return CATEGORY_FALLBACK_URLS.beauty;
  if (catSlug.includes("sport")) return CATEGORY_FALLBACK_URLS.sports;
  if (catSlug.includes("book")) return CATEGORY_FALLBACK_URLS.books;
  if (catSlug.includes("car")) return CATEGORY_FALLBACK_URLS.car;
  if (catSlug.includes("toy")) return CATEGORY_FALLBACK_URLS.toys;

  return CATEGORY_FALLBACK_URLS.generic;
}
