import { SubcategoryConfig } from "./types.js";

export const beautyHealthConfigs: SubcategoryConfig[] = [
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "luxury-beauty",
    subcategoryId: "sub-7-1",
    name: "Luxury Beauty",
    brands: ["Forest Essentials", "Kama Ayurveda", "Estee Lauder", "Clinique", "L'Occitane", "The Body Shop"],
    priceRange: { min: 1299, max: 8999 },
    imagePool: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-07406c1ec02a?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Soundarya Radiance Facial Serum with 24K Gold (30ml)",
        description: "Prestigious Ayurvedic facial elixir infused with pure 24-karat gold bhasma, saffron, and sweet almond oil to revitalize dull skin, enhance elasticity, and bestow a luminous royal glow.",
        shortDescription: "Ayurvedic 24K gold radiance night facial serum for youthful luminosity.",
        specifications: { "Volume": "30 ml Glass Dropper Bottle", "Key Actives": "24K Pure Gold Bhasma, Kashmiri Saffron, Sandalwood", "Skin Type": "Suitable for All Skin Types", "Formula": "100% Natural, Paraben & Mineral Oil Free" },
        features: ["Micro-fine gold particles absorb deeply to stimulate skin regeneration", "Reduces visible fine lines, pigmentation, and uneven texture", "Delicate natural floral aroma soothes the senses before sleep", "Dermatologically tested and certified organic Ayurvedic formulation"],
        tags: ["luxury beauty", "face serum", "gold serum", "ayurveda", "anti aging"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "makeup",
    subcategoryId: "sub-7-2",
    name: "Make-up",
    brands: ["Maybelline", "L'Oreal Paris", "Lakme", "Sugar Cosmetics", "Colorbar", "Nykaa"],
    priceRange: { min: 399, max: 2499 },
    imagePool: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} SuperStay 16H Matte Liquid Lipstick / Foundation",
        description: "Transfer-proof, smudge-resistant liquid lipstick with intense pigment payoff that stays flawlessly locked on lips for up to 16 hours. Enriched with nourishing vitamin E.",
        shortDescription: "16-hour transfer-proof matte liquid lipstick with precision arrow applicator.",
        specifications: { "Finish": "Non-Drying Velvety Matte", "Stay Power": "Up to 16 Hours Transfer-Proof", "Weight": "5.0 ml", "Applicator": "Precision Arrow Tip Wand" },
        features: ["Will not smudge or transfer onto cups, masks, or cutlery", "High-intensity rich color in a single smooth gliding stroke", "Lightweight formula leaves lips feeling comfortable without flaking", "Available in an extensive palette of flattering Indian nude and bold shades"],
        colors: ["Seductress Nude", "Pioneer Crimson", "Ruler Mauve", "Amazonian Mocha"],
        tags: ["makeup", "lipstick", "matte lipstick", "cosmetics", "maybelline"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "health-personal-care",
    subcategoryId: "sub-7-3",
    name: "Health & Personal Care",
    brands: ["Dettol", "Himalaya", "Nivea", "Savlon", "Oral-B", "Pampers"],
    priceRange: { min: 199, max: 1999 },
    imagePool: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Complete Care Antiseptic Liquid / Skin Healing Balm (1 Litre)",
        description: "Trusted household antiseptic solution providing proven protection against 100 illness-causing germs. Suitable for first aid cuts, wound washing, personal hygiene, and shaving care.",
        shortDescription: "Multi-purpose germ protection antiseptic liquid for first aid and personal hygiene.",
        specifications: { "Net Volume": "1000 ml (1 Litre Economy Refill)", "Protection": "Kills 99.99% of Germs and Bacteria", "Formula": "Chloroxylenol Active Compound", "Usage": "First Aid, Shaving, Bathing, Surface Cleaning" },
        features: ["Recommended by medical associations worldwide for wound disinfection", "Gentle on skin when diluted according to instructions", "Prevents infection in minor cuts, bites, abrasions, and stings", "Leaves a reassuring signature clean herbal fragrance"],
        tags: ["antiseptic", "health personal care", "dettol", "hygiene", "first aid"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "household-supplies",
    subcategoryId: "sub-7-4",
    name: "Household Supplies",
    brands: ["Ariel", "Surf Excel", "Comfort", "Vim", "Colin", "Lizol"],
    priceRange: { min: 199, max: 1499 },
    imagePool: [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Matic Top/Front Load Liquid Laundry Detergent (4 Litres)",
        description: "Advanced concentrated liquid detergent engineered for automatic washing machines. Dissolves instantly in water, penetrates deep fibers, and lifts stubborn grease stains.",
        shortDescription: "4 Litre matic liquid laundry detergent pouch for top and front load washers.",
        specifications: { "Net Quantity": "4 Litres Pouch with Easy-Pour Spout", "Form": "Ultra-Concentrated Color-Safe Liquid", "Compatibility": "Front Load & Top Load Washing Machines", "Fragrance": "Long-Lasting Fresh Ocean Breeze" },
        features: ["Produces optimal low-foam lather tailored to automatic machine pumps", "Tough on cuff and collar dirt while gentle on delicate garment fibers", "Leaves clothes with a long-lasting floral freshness for up to 7 days", "Dissolves 100% without leaving chalky white detergent residue"],
        tags: ["detergent", "laundry", "household supplies", "cleaning", "surf excel"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "personal-care-appliances",
    subcategoryId: "sub-7-5",
    name: "Personal Care Appliances",
    brands: ["Philips", "Braun", "Havells", "Vega", "Syska", "Oral-B"],
    priceRange: { min: 899, max: 7999 },
    imagePool: [
      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} All-in-One Cordless Beard Trimmer & Grooming Kit",
        description: "Self-sharpening stainless steel blade beard and hair trimmer offering 20 lock-in precision length settings (0.5mm to 10mm). Features 90 minutes of cordless runtime and USB fast charging.",
        shortDescription: "Cordless multi-groomer beard trimmer with 20 length settings and 90min battery.",
        specifications: { "Runtime": "90 Minutes on 1-Hour Quick Charge", "Precision": "0.5mm Steps across 20 Lengths", "Blades": "Skin-Friendly Self-Sharpening Stainless Steel", "Washability": "Fully Washable Detachable Head" },
        features: ["DuraPower technology prolongs battery and motor lifespan by 4x", "Rounded blade tips glide smoothly preventing skin nicks and irritation", "LED battery indicator alerts when charging is needed", "Includes travel pouch, precision comb, and cleaning brush"],
        tags: ["trimmer", "beard trimmer", "grooming", "philips", "personal care appliances"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "diet-nutrition",
    subcategoryId: "sub-7-6",
    name: "Diet & Nutrition",
    brands: ["MuscleBlaze", "Optimum Nutrition", "Isopure", "Fast&Up", "GNC", "HealthKart"],
    priceRange: { min: 999, max: 7499 },
    imagePool: [
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80",
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} 100% Whey Protein Isolate Powder with Digestive Enzymes (1kg / 2.2 lbs)",
        description: "Ultra-pure micro-filtered whey protein isolate delivering 25g of pure protein, 5.5g BCAAs, and zero added sugar per scoop. Enhanced with DigeZyme for superior digestive absorption.",
        shortDescription: "25g protein per scoop whey isolate with BCAAs and digestive enzymes.",
        specifications: { "Protein Per Serving": "25 Grams Pure Whey Isolate", "BCAAs": "5.5 Grams Natural Branched-Chain Amino Acids", "Net Weight": "1 kg (approx. 33 Servings)", "Certification": "Informed Choice Tested & Labdoor Certified" },
        features: ["Fast-absorbing formula ideal for post-workout muscle recovery", "Added digestive enzyme blend prevents bloating and indigestion", "Mixes effortlessly in cold water or milk without clumps", "Strictly tested for zero heavy metal contamination or banned substances"],
        colors: ["Rich Milk Chocolate", "Cafe Mocha", "Almond Vanilla", "Cookies & Cream"],
        tags: ["whey protein", "nutrition", "protein powder", "fitness", "supplements"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "grocery-gourmet",
    subcategoryId: "sub-7-7",
    name: "Grocery & Gourmet Foods",
    brands: ["Tata Sampann", "Fortune", "Aashirvaad", "Daawat", "Organic Tattva", "Saffola"],
    priceRange: { min: 149, max: 1899 },
    imagePool: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Rozana Super Aged Extra-Long Basmati Rice (5 Kg)",
        description: "Naturally aged for 2 years, this fragrant Himalayan basmati rice features extra-long grains that elongate to twice their size upon cooking. Non-sticky and fluffy texture.",
        shortDescription: "5 Kg 2-year naturally aged aromatic long-grain basmati rice.",
        specifications: { "Net Weight": "5 Kilograms", "Aging": "Naturally Aged for 24 Months", "Grain Type": "Slender Extra-Long Grain", "Ideal For": "Biryani, Pulao, and Daily Dining" },
        features: ["Fluffy non-sticky grains with distinct sweet natural aroma", "Low glycemic index suitable for healthy family meals", "Hygienically sorted and packaged under stringent quality controls", "Easy resealable handle bag for pantry convenience"],
        tags: ["basmati rice", "grocery", "rice", "food", "gourmet"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "coffee-tea-beverages",
    subcategoryId: "sub-7-8",
    name: "Coffee, Tea & Beverages",
    brands: ["Nescafe", "Tata Tea", "Blue Tokai", "Sleepy Owl", "Red Label", "Twinings"],
    priceRange: { min: 199, max: 1499 },
    imagePool: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Artisanal 100% Arabica Medium Roast Coffee Beans / Ground (250g)",
        description: "Single-origin estate-grown 100% Arabica specialty coffee roasted to perfection in small batches. Delivers tasting notes of dark chocolate, roasted hazelnut, and caramel sweetness.",
        shortDescription: "250g single-origin 100% Arabica medium roast freshly roasted coffee.",
        specifications: { "Weight": "250 Grams Valve Degassing Pouch", "Roast Level": "Medium Roast", "Origin": "Chikmagalur / Coorg High-Altitude Estates", "Grind Size": "Available in Whole Beans or French Press / Drip Grind" },
        features: ["Freshly roasted in micro-batches for maximum aroma extraction", "Rich crema and balanced acidity for espresso, pour-over, and French press", "One-way degassing valve locks in volatile aromatic oils", "Directly sourced through fair trade ethical partnerships with planters"],
        tags: ["coffee", "arabica", "specialty coffee", "beverages", "ground coffee"],
      },
    ],
  },
  {
    categorySlug: "beauty-health-grocery",
    subcategorySlug: "packaged-foods-snacks",
    subcategoryId: "sub-7-9",
    name: "Snack Foods",
    brands: ["Haldiram's", "Lays", "Kurkure", "Pringles", "Britannia", "Cadbury"],
    priceRange: { min: 99, max: 999 },
    imagePool: [
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80",
      "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=800&q=80",
    ],
    productTemplates: [
      {
        namePattern: "{brand} Premium Festive Sweets & Dry Fruit Gift Box (800g)",
        description: "A decadent gourmet assortment of Californian roasted almonds, whole cashews, Afghani raisins, and handcrafted traditional sweets packaged in an ornamental luxury box.",
        shortDescription: "800g luxury dry fruit and gourmet sweets gift assortment box.",
        specifications: { "Net Weight": "800 Grams Assorted", "Contents": "Roasted Almonds, Salted Cashews, Golden Raisins, Kaju Katli", "Shelf Life": "6 Months from Packaging", "Packaging": "Gold-Embossed Heritage Gift Box" },
        features: ["Handpicked jumbo grade whole dry fruits with crisp crunch", "Vacuum sealed inner compartments ensure prolonged fresh crispness", "No artificial coloring, preservatives, or palm oil", "The ultimate celebratory gift for Diwali, weddings, and milestones"],
        tags: ["snacks", "dry fruits", "sweets", "gift box", "packaged foods"],
      },
    ],
  },
];
