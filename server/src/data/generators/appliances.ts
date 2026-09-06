import { SubcategoryConfig } from "./types.js";

export const appliancesConfigs: SubcategoryConfig[] = [
  {
    categorySlug: "appliances",
    subcategorySlug: "air-conditioners",
    subcategoryId: "sub-3-1",
    name: "Air Conditioners",
    brands: ["Voltas", "LG", "Daikin", "Carrier", "Lloyd", "Panasonic", "Blue Star"],
    priceRange: { min: 28990, max: 64990 },
    imagePool: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} 1.5 Ton 5 Star Inverter Split AC (Copper, Anti-Bacterial Filter)",
        description: "High-efficiency variable speed inverter compressor split AC adjusting power depending on heat load. Features 100% copper condenser tubes with Blue Fin anti-corrosion protection and 4-way air swing.",
        shortDescription: "1.5 Ton 5 Star Inverter Split AC with PM 2.5 air purification.",
        specifications: { "Capacity": "1.5 Ton (Ideal for 150-180 sq ft)", "Energy Rating": "5 Star BEE Rating", "Condenser": "100% Grooved Copper", "Refrigerant": "Eco-Friendly R32 Gas" },
        features: ["Dual inverter compressor for ultra-fast cooling", "Convertible 6-in-1 cooling modes save power", "Cools efficiently even at 52°C ambient temperature", "Hidden digital temperature display"],
        tags: ["air conditioner", "split ac", "inverter ac", "appliances"],
      },
    ],
  },
  {
    categorySlug: "appliances",
    subcategorySlug: "refrigerators",
    subcategoryId: "sub-3-2",
    name: "Refrigerators",
    brands: ["Samsung", "LG", "Whirlpool", "Haier", "Godrej", "Bosch"],
    priceRange: { min: 14990, max: 94990 },
    imagePool: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} 265L 3 Star Frost Free Double Door Refrigerator",
        description: "Intelligent frost-free double door refrigerator featuring smart digital inverter technology, multi-air flow cooling vents, toughened glass shelves, and anti-bacterial gasket.",
        shortDescription: "265L frost-free double door refrigerator with digital inverter compressor.",
        specifications: { "Capacity": "265 Litres (Fresh Food: 195L, Freezer: 70L)", "Energy Rating": "3 Star BEE", "Defrost System": "Frost Free Auto-Defrost", "Shelves": "Spill-Proof Toughened Glass" },
        features: ["Convertible freezer expands fridge space on demand", "Deodorizing filter eliminates unpleasant food odors", "Moist fresh crisper zone keeps vegetables fresh for 15 days", "Operates smoothly without external voltage stabilizer"],
        colors: ["Refined Inox Steel", "Luxe Black Glass", "Dazzle Steel"],
        tags: ["refrigerator", "fridge", "double door", "appliances"],
      },
    ],
  },
  {
    categorySlug: "appliances",
    subcategorySlug: "washing-machines",
    subcategoryId: "sub-3-3",
    name: "Washing Machines",
    brands: ["LG", "Samsung", "IFB", "Bosch", "Whirlpool", "Godrej"],
    priceRange: { min: 13990, max: 54990 },
    imagePool: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} 7.0 Kg 5 Star Fully-Automatic Front Load Washing Machine",
        description: "High-efficiency front loading washing machine with AI Direct Drive motor, steam allergy care cycle, stainless steel drum, and 14 customized wash programs.",
        shortDescription: "7.0 Kg fully automatic front load washer with steam wash and 1200 RPM.",
        specifications: { "Capacity": "7.0 Kg (Ideal for families of 3-4)", "Spin Speed": "1200 RPM Fast Spin", "Energy Rating": "5 Star BEE Certified", "Motor": "Direct Drive Inverter Motor" },
        features: ["Steam hygiene wash removes 99.9% of allergens and bacteria", "6 Motion drum movements tailored to different fabric types", "Child lock and silent operation under 54 dB", "Smart diagnostic troubleshooting via smartphone"],
        colors: ["Platinum Silver", "Middle Black", "White"],
        tags: ["washing machine", "front load", "laundry", "appliances"],
      },
    ],
  },
  {
    categorySlug: "appliances",
    subcategorySlug: "kitchen-appliances",
    subcategoryId: "sub-3-4",
    name: "Kitchen & Home Appliances",
    brands: ["Prestige", "Philips", "Morphy Richards", "Bajaj", "Havells", "Panasonic", "Kent"],
    priceRange: { min: 1299, max: 18999 },
    imagePool: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} 750W Heavy-Duty Mixer Grinder with 3 Stainless Steel Jars",
        description: "Powerful 750W copper motor mixer grinder engineered for tough Indian kitchen grinding (idli batter, spices, chutneys). Comes with 3 flow-breaker stainless steel jars.",
        shortDescription: "750W heavy-duty mixer grinder with 3 stainless steel jars.",
        specifications: { "Wattage": "750 Watts Pure Copper Motor", "Speed Control": "3 Speeds with Pulse Function", "Jars": "1.5L Liquidizing, 1.0L Dry, 0.4L Chutney Jar", "Blades": "High-Grade Stainless Steel" },
        features: ["Overload protector prevents motor burn-out", "Anti-skid vacuum suction feet provide firm countertop grip", "Flow-breaker jar design ensures uniform grinding", "Ergonomic handles with sturdy jar locks"],
        colors: ["Classic White/Blue", "Metallic Red", "Black/Silver"],
        tags: ["mixer grinder", "kitchen appliances", "grinder", "blender"],
      },
    ],
  },
  {
    categorySlug: "appliances",
    subcategorySlug: "heating-cooling",
    subcategoryId: "sub-3-5",
    name: "Heating & Cooling Appliances",
    brands: ["Havells", "Bajaj", "Usha", "Crompton", "Orient", "Morphy Richards"],
    priceRange: { min: 999, max: 12999 },
    imagePool: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Energy-Saving BLDC Ceiling Fan with Remote (1200mm)",
        description: "Modern aerodynamic ceiling fan powered by an ultra-efficient Brushless DC (BLDC) motor that consumes only 28W, saving up to 65% on electricity bills.",
        shortDescription: "1200mm energy-efficient BLDC ceiling fan with smart remote control.",
        specifications: { "Sweep": "1200mm (48 Inches)", "Power Consumption": "28 Watts at Top Speed", "Air Delivery": "230 CMM High Air Flow", "Motor": "100% Copper BLDC Motor" },
        features: ["Saves up to ₹1,500 on electricity bills annually", "Point-anywhere RF remote control with timer and boost mode", "Operates consistently even during low voltage fluctuations", "Rust-free powder-coated aluminum ribbed blades"],
        colors: ["Pearl White", "Smoked Brown", "Matte Black"],
        tags: ["ceiling fan", "bldc fan", "cooling", "appliances"],
      },
    ],
  },
  {
    categorySlug: "appliances",
    subcategorySlug: "all-appliances",
    subcategoryId: "sub-3-6",
    name: "All Appliances",
    brands: ["Philips", "Morphy Richards", "Prestige", "Bajaj", "Havells"],
    priceRange: { min: 799, max: 14999 },
    imagePool: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Digital Air Fryer with Rapid Air Technology (4.2 Litres)",
        description: "Cook delicious crispy meals with up to 90% less oil. Rapid hot air circulation with digital touchscreen presets for baking, grilling, frying, and roasting.",
        shortDescription: "4.2L digital touchscreen air fryer for guilt-free crispy cooking.",
        specifications: { "Capacity": "4.2 Litres", "Power": "1400 Watts", "Temperature": "80°C - 200°C Adjustable", "Timer": "Up to 60 Minutes with Auto Shut-Off" },
        features: ["Rapid air circulation achieves golden crispness with 90% less oil", "7 one-touch cooking presets for fries, chicken, snacks, and cake", "Non-stick dishwasher-safe food basket", "Cool-touch exterior handle with safety interlock"],
        colors: ["Matte Black", "Glossy White"],
        tags: ["air fryer", "healthy cooking", "kitchen appliances", "appliances"],
      },
    ],
  },
];
