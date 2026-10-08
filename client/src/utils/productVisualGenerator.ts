/**
 * Product Visual Generator for ShopSphere (Client-side)
 * Generates bespoke, high-resolution SVG artwork for individual products when
 * unique photographic images are missing, duplicate, or unverified.
 */

export interface VisualOptions {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
  perspective?: 1 | 2 | 3 | 4;
}

interface ColorTheme {
  name: string;
  bgStart: string;
  bgEnd: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  foil: string;
}

const LUXURY_PALETTES: ColorTheme[] = [
  { name: "Midnight Navy", bgStart: "#0a192f", bgEnd: "#172a45", accent: "#ffd700", textPrimary: "#ffffff", textSecondary: "#94a3b8", border: "#ffd70044", foil: "#fbbf24" },
  { name: "Emerald Pine", bgStart: "#064e3b", bgEnd: "#042f2e", accent: "#34d399", textPrimary: "#ffffff", textSecondary: "#a7f3d0", border: "#34d39944", foil: "#6ee7b7" },
  { name: "Crimson Velvet", bgStart: "#450a0a", bgEnd: "#7f1d1d", accent: "#fca5a5", textPrimary: "#ffffff", textSecondary: "#fecaca", border: "#f8717144", foil: "#fb7185" },
  { name: "Royal Obsidian", bgStart: "#09090b", bgEnd: "#18181b", accent: "#e2e8f0", textPrimary: "#ffffff", textSecondary: "#a1a1aa", border: "#e2e8f033", foil: "#f8fafc" },
  { name: "Deep Indigo", bgStart: "#1e1b4b", bgEnd: "#312e81", accent: "#c7d2fe", textPrimary: "#ffffff", textSecondary: "#a5b4fc", border: "#818cf844", foil: "#a5b4fc" },
  { name: "Vintage Leather", bgStart: "#382010", bgEnd: "#5c3317", accent: "#fde047", textPrimary: "#ffffff", textSecondary: "#fef08a", border: "#eab30844", foil: "#facc15" },
  { name: "Nordic Teal", bgStart: "#042f2e", bgEnd: "#115e59", accent: "#5eead4", textPrimary: "#ffffff", textSecondary: "#99f6e4", border: "#2dd4bf44", foil: "#2dd4bf" },
  { name: "Imperial Plum", bgStart: "#3b0764", bgEnd: "#581c87", accent: "#f0abfc", textPrimary: "#ffffff", textSecondary: "#e879f9", border: "#c084fc44", foil: "#e879f9" },
  { name: "Sapphire Steel", bgStart: "#0c4a6e", bgEnd: "#075985", accent: "#7dd3fc", textPrimary: "#ffffff", textSecondary: "#bae6fd", border: "#38bdf844", foil: "#38bdf8" },
  { name: "Burnt Terracotta", bgStart: "#431407", bgEnd: "#7c2d12", accent: "#fed7aa", textPrimary: "#ffffff", textSecondary: "#ffedd5", border: "#fb923c44", foil: "#f97316" },
  { name: "Classic Charcoal", bgStart: "#1c1917", bgEnd: "#292524", accent: "#fafaf9", textPrimary: "#ffffff", textSecondary: "#d6d3d1", border: "#a8a29e44", foil: "#e7e5e4" },
  { name: "Bordeaux Wine", bgStart: "#3b0b1c", bgEnd: "#681335", accent: "#fbcfe8", textPrimary: "#ffffff", textSecondary: "#f472b6", border: "#ec489944", foil: "#f43f5e" },
  { name: "Atlantic Slate", bgStart: "#0f172a", bgEnd: "#1e293b", accent: "#38bdf8", textPrimary: "#ffffff", textSecondary: "#94a3b8", border: "#0284c744", foil: "#38bdf8" },
  { name: "Cognac Amber", bgStart: "#451a03", bgEnd: "#78350f", accent: "#fde68a", textPrimary: "#ffffff", textSecondary: "#fcd34d", border: "#f59e0b44", foil: "#fbbf24" },
  { name: "Dark Moss", bgStart: "#14532d", bgEnd: "#166534", accent: "#bbf7d0", textPrimary: "#ffffff", textSecondary: "#86efac", border: "#4ade8044", foil: "#22c55e" },
  { name: "Celestial Bronze", bgStart: "#261a10", bgEnd: "#452d1a", accent: "#fdba74", textPrimary: "#ffffff", textSecondary: "#fed7aa", border: "#fb923c44", foil: "#f97316" },
];

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function selectTheme(seed: string): ColorTheme {
  const idx = stringHash(seed) % LUXURY_PALETTES.length;
  return LUXURY_PALETTES[idx];
}

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number = 22, maxLines: number = 4): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  return lines;
}

function generateBookVisual(options: VisualOptions): string {
  const { id, name, subcategory, brand, perspective = 1 } = options;
  const theme = selectTheme(`${id}-${name}`);
  const titleLines = wrapText(name, 20, 3);
  const isKindle = subcategory.toLowerCase().includes("kindle");
  const badgeText = isKindle ? "KINDLE EDITION" : subcategory.toUpperCase().replace(/-/g, " ");
  const authorText = brand || "ShopSphere Editions";

  let perspectiveSvg = "";

  if (perspective === 1) {
    perspectiveSvg = `
      <g transform="translate(140, 60)">
        <rect x="15" y="15" width="520" height="680" rx="14" fill="#000000" opacity="0.35" filter="blur(18px)"/>
        <rect x="0" y="0" width="520" height="680" rx="12" fill="url(#bgGrad)" stroke="${theme.border}" stroke-width="2"/>
        <rect x="0" y="0" width="36" height="680" rx="4" fill="url(#spineGrad)"/>
        <line x1="36" y1="0" x2="36" y2="680" stroke="#000000" stroke-width="1.5" opacity="0.4"/>
        <line x1="37.5" y1="0" x2="37.5" y2="680" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/>
        <rect x="56" y="28" width="438" height="624" rx="6" fill="none" stroke="${theme.foil}" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.6"/>
        <rect x="64" y="36" width="422" height="608" rx="4" fill="none" stroke="${theme.foil}" stroke-width="0.8" opacity="0.4"/>
        <circle cx="56" cy="28" r="4" fill="${theme.foil}"/>
        <circle cx="494" cy="28" r="4" fill="${theme.foil}"/>
        <circle cx="56" cy="652" r="4" fill="${theme.foil}"/>
        <circle cx="494" cy="652" r="4" fill="${theme.foil}"/>
        <!-- Category / Format Badge -->
        <g transform="translate(275, 95)">
          <rect x="-110" y="-14" width="220" height="28" rx="14" fill="${theme.foil}22" stroke="${theme.foil}" stroke-width="1"/>
          <text x="0" y="5" text-anchor="middle" fill="${theme.foil}" font-family="sans-serif" font-size="10.5" font-weight="800" letter-spacing="2">${escapeXml(badgeText)}</text>
        </g>
        
        <!-- Product Reference ID -->
        <text x="275" y="132" text-anchor="middle" fill="${theme.foil}" font-family="monospace, Courier" font-size="9.5" font-weight="600" opacity="0.75" letter-spacing="1.5">ITEM ID: ${escapeXml(id.toUpperCase())}</text>
        
        <g transform="translate(275, 230)">
          ${titleLines.map((line, idx) => `
            <text x="0" y="${idx * 46}" text-anchor="middle" fill="${theme.textPrimary}" font-family="serif, Georgia" font-size="${titleLines.length > 2 ? '30' : '34'}" font-weight="bold" letter-spacing="0.5">${escapeXml(line)}</text>
          `).join("")}
        </g>
        
        <g transform="translate(275, 430)">
          <line x1="-80" y1="0" x2="80" y2="0" stroke="${theme.foil}" stroke-width="1.2" opacity="0.6"/>
          <polygon points="0,-12 10,0 0,12 -10,0" fill="${theme.foil}"/>
          <circle cx="-50" cy="0" r="3" fill="${theme.foil}"/>
          <circle cx="50" cy="0" r="3" fill="${theme.foil}"/>
        </g>
        
        <text x="275" y="540" text-anchor="middle" fill="${theme.textSecondary}" font-family="sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">${escapeXml(authorText)}</text>
        <text x="275" y="565" text-anchor="middle" fill="${theme.foil}" font-family="sans-serif" font-size="11" font-weight="600" letter-spacing="2">SHOPSPHERE VERIFIED EDITION</text>
        
        <g transform="translate(275, 615)">
          <circle cx="0" cy="0" r="16" fill="none" stroke="${theme.foil}" stroke-width="1" opacity="0.7"/>
          <text x="0" y="4" text-anchor="middle" fill="${theme.foil}" font-family="serif" font-size="11" font-weight="bold">★</text>
        </g>
      </g>
    `;
  } else if (perspective === 2) {
    perspectiveSvg = `
      <g transform="translate(180, 70)">
        <polygon points="80,670 480,670 540,580 140,580" fill="#000000" opacity="0.4" filter="blur(16px)"/>
        <polygon points="40,110 90,60 90,640 40,690" fill="${theme.bgEnd}" stroke="${theme.border}" stroke-width="1.5"/>
        <line x1="42" y1="110" x2="42" y2="690" stroke="#ffffff" stroke-width="1" opacity="0.2"/>
        
        <g transform="translate(62, 380) rotate(-90)">
          <text x="0" y="4" text-anchor="middle" fill="${theme.foil}" font-family="serif" font-size="15" font-weight="bold" letter-spacing="1">${escapeXml(titleLines[0] || name)}</text>
        </g>
        
        <polygon points="90,60 470,30 470,610 90,640" fill="url(#bgGrad)" stroke="${theme.border}" stroke-width="1.5"/>
        <g transform="matrix(0.96, -0.076, 0, 0.96, 95, 80)">
          <text x="180" y="80" text-anchor="middle" fill="${theme.foil}" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="2">${escapeXml(badgeText)}</text>
          ${titleLines.slice(0, 3).map((line, idx) => `
            <text x="180" y="${170 + idx * 40}" text-anchor="middle" fill="${theme.textPrimary}" font-family="serif" font-size="25" font-weight="bold">${escapeXml(line)}</text>
          `).join("")}
          <line x1="100" y1="320" x2="260" y2="320" stroke="${theme.foil}" stroke-width="1.5" opacity="0.6"/>
          <text x="180" y="420" text-anchor="middle" fill="${theme.textSecondary}" font-family="sans-serif" font-size="15" font-weight="700">${escapeXml(authorText)}</text>
        </g>
        
        <polygon points="90,60 470,30 500,45 120,75" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
        <polygon points="470,30 500,45 500,625 470,610" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        ${[1, 2, 3, 4, 5, 6, 7].map(k => `
          <line x1="475" y1="${35 + k * 80}" x2="495" y2="${48 + k * 80}" stroke="#cbd5e1" stroke-width="0.8" opacity="0.7"/>
        `).join("")}
      </g>
    `;
  } else if (perspective === 3) {
    perspectiveSvg = `
      <g transform="translate(80, 90)">
        <rect x="20" y="30" width="600" height="520" rx="16" fill="#000000" opacity="0.35" filter="blur(18px)"/>
        <path d="M 40,40 Q 180,30 320,45 L 320,530 Q 180,515 40,525 Z" fill="#fefefe" stroke="#e2e8f0" stroke-width="1.5"/>
        <path d="M 320,45 Q 460,30 600,40 L 600,525 Q 460,515 320,530 Z" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="320" y1="42" x2="320" y2="532" stroke="#64748b" stroke-width="3" opacity="0.4"/>
        <path d="M 320,35 Q 315,200 300,320 L 320,560 L 340,320 Q 325,200 320,35 Z" fill="${theme.foil}" opacity="0.9"/>
        
        <g transform="translate(60, 80)">
          <text x="120" y="40" text-anchor="middle" fill="${theme.bgStart}" font-family="serif" font-size="18" font-weight="bold">${escapeXml(titleLines[0] || name)}</text>
          <text x="120" y="65" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="11" font-weight="600">${escapeXml(badgeText)}</text>
          <line x1="40" y1="85" x2="200" y2="85" stroke="${theme.foil}" stroke-width="1"/>
          ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
            <rect x="30" y="${120 + i * 28}" width="${i === 7 ? '110' : '180'}" height="6" rx="3" fill="#94a3b8" opacity="0.4"/>
          `).join("")}
          <text x="120" y="420" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="10">Page 1</text>
        </g>
        
        <g transform="translate(340, 80)">
          <text x="120" y="40" text-anchor="middle" fill="${theme.bgStart}" font-family="serif" font-size="16" font-weight="bold">Chapter 1</text>
          <line x1="80" y1="65" x2="160" y2="65" stroke="${theme.foil}" stroke-width="1"/>
          ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
            <rect x="30" y="${120 + i * 28}" width="${i === 7 ? '130' : '180'}" height="6" rx="3" fill="#94a3b8" opacity="0.35"/>
          `).join("")}
          <text x="120" y="420" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="10">Page 2</text>
        </g>
      </g>
    `;
  } else {
    perspectiveSvg = `
      <g transform="translate(100, 60)">
        <rect x="0" y="0" width="600" height="680" rx="16" fill="url(#bgGrad)" stroke="${theme.border}" stroke-width="3"/>
        <g stroke="${theme.foil}" stroke-width="0.8" opacity="0.25">
          ${[1, 2, 3, 4, 5].map(i => `
            <line x1="50" y1="${i * 110}" x2="550" y2="${i * 110}"/>
            <line x1="${i * 100}" y1="50" x2="${i * 100}" y2="630"/>
          `).join("")}
        </g>
        <circle cx="300" cy="220" r="110" fill="none" stroke="${theme.foil}" stroke-width="3" stroke-dasharray="12 6"/>
        <circle cx="300" cy="220" r="96" fill="${theme.bgEnd}" stroke="${theme.foil}" stroke-width="1.5"/>
        <polygon points="300,165 315,195 350,195 322,215 332,245 300,225 268,245 278,215 250,195 285,195" fill="${theme.foil}"/>
        <text x="300" y="275" text-anchor="middle" fill="${theme.foil}" font-family="sans-serif" font-size="12" font-weight="800" letter-spacing="2">AUTHENTIC EDITION</text>
        
        <g transform="translate(300, 420)">
          <text x="0" y="0" text-anchor="middle" fill="${theme.textPrimary}" font-family="serif" font-size="34" font-weight="bold">${escapeXml(titleLines[0] || name)}</text>
          ${titleLines[1] ? `
            <text x="0" y="45" text-anchor="middle" fill="${theme.textPrimary}" font-family="serif" font-size="30" font-weight="bold">${escapeXml(titleLines[1])}</text>
          ` : ""}
          <line x1="-120" y1="90" x2="120" y2="90" stroke="${theme.foil}" stroke-width="2"/>
          <text x="0" y="130" text-anchor="middle" fill="${theme.textSecondary}" font-family="sans-serif" font-size="16" font-weight="700">${escapeXml(authorText)}</text>
        </g>
      </g>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bgStart}"/>
          <stop offset="100%" stop-color="${theme.bgEnd}"/>
        </linearGradient>
        <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
          <stop offset="60%" stop-color="#ffffff" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#f8fafc"/>
      ${perspectiveSvg}
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateGeneralVisual(options: VisualOptions): string {
  const { id, name, category, subcategory, brand, perspective = 1 } = options;
  const theme = selectTheme(`${id}-${category}-${name}`);
  const titleLines = wrapText(name, 22, 2);

  const angleLabels = [
    "PRIMARY STUDIO VIEW",
    "SPECIFICATIONS & ARCHITECTURE",
    "INTERACTIVE COMPONENT VIEW",
    "PRECISION CRAFTSMANSHIP MACRO",
  ];
  const angleLabel = angleLabels[perspective - 1] || angleLabels[0];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <linearGradient id="bgCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bgStart}"/>
          <stop offset="100%" stop-color="${theme.bgEnd}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#f8fafc"/>
      <g transform="translate(60, 60)">
        <rect x="0" y="0" width="680" height="680" rx="24" fill="url(#bgCanvas)" stroke="${theme.border}" stroke-width="2"/>
        <rect x="40" y="40" width="600" height="50" rx="12" fill="#ffffff12" stroke="${theme.foil}" stroke-width="1" stroke-opacity="0.4"/>
        <text x="60" y="72" fill="${theme.foil}" font-family="sans-serif" font-size="13" font-weight="800" letter-spacing="2">${escapeXml(brand ? brand.toUpperCase() : "SHOPSPHERE VERIFIED")}</text>
        <text x="620" y="72" text-anchor="end" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">${escapeXml(subcategory.toUpperCase().replace(/-/g, " "))}</text>
        
        <g transform="translate(340, 310)">
          <circle cx="0" cy="0" r="140" fill="none" stroke="${theme.foil}" stroke-width="2" stroke-dasharray="16 8" opacity="0.4"/>
          <circle cx="0" cy="0" r="115" fill="#ffffff08" stroke="${theme.border}" stroke-width="1"/>
          <rect x="-60" y="-60" width="120" height="120" rx="20" fill="${theme.foil}22" stroke="${theme.foil}" stroke-width="2"/>
          <polygon points="0,-35 30,20 -30,20" fill="${theme.foil}"/>
          <circle cx="0" cy="0" r="12" fill="${theme.bgStart}"/>
        </g>
        
        <g transform="translate(340, 480)">
          <rect x="-140" y="-14" width="280" height="28" rx="14" fill="#ffffff18" stroke="${theme.foil}" stroke-width="1"/>
          <text x="0" y="5" text-anchor="middle" fill="${theme.foil}" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="2">${escapeXml(angleLabel)}</text>
        </g>
        
        <g transform="translate(340, 550)">
          ${titleLines.map((l, i) => `
            <text x="0" y="${i * 36}" text-anchor="middle" fill="${theme.textPrimary}" font-family="sans-serif" font-size="22" font-weight="bold">${escapeXml(l)}</text>
          `).join("")}
        </g>
        <!-- Quality Guarantee Seal Footer -->
        <text x="340" y="635" text-anchor="middle" fill="${theme.textSecondary}" font-family="sans-serif" font-size="11.5" font-weight="600" letter-spacing="1.5">100% AUTHENTIC • SHOPSPHERE CERTIFIED PRODUCT</text>
        <text x="340" y="654" text-anchor="middle" fill="${theme.foil}" font-family="monospace, Courier" font-size="9.5" font-weight="600" opacity="0.8">ITEM SKU: ${escapeXml(id.toUpperCase())}</text>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateProductVisual(options: VisualOptions): string {
  const cat = (options.category || "").toLowerCase();
  const sub = (options.subcategory || "").toLowerCase();

  if (cat.includes("book") || sub.includes("book") || sub.includes("exam") || sub.includes("kindle")) {
    return generateBookVisual(options);
  }

  return generateGeneralVisual(options);
}

export function generateProductGallery(product: {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
}): string[] {
  return [1, 2, 3, 4].map((p) =>
    generateProductVisual({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      perspective: p as 1 | 2 | 3 | 4,
    })
  );
}
