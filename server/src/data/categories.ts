export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  itemCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bannerImage: string;
  description: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    icon: "Tv",
    bannerImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80",
    description: "Immersive 4K/8K smart TVs, studio soundbars, noise-canceling headphones, and pro cameras.",
    subcategories: [
      { id: "sub-1-1", name: "Smart TVs & Displays", slug: "smart-tvs" },
      { id: "sub-1-2", name: "Audio & Headphones", slug: "audio-headphones" },
      { id: "sub-1-3", name: "Soundbars & Home Theater", slug: "soundbars-home-theater" },
      { id: "sub-1-4", name: "Cameras & Photography", slug: "cameras-photography" },
      { id: "sub-1-5", name: "Gaming Consoles & Gear", slug: "gaming-consoles" },
      { id: "sub-1-6", name: "Smart Speakers & Assistants", slug: "smart-speakers" },
    ],
  },
  {
    id: "cat-2",
    name: "Mobiles",
    slug: "mobiles",
    icon: "Smartphone",
    bannerImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
    description: "Flagship 5G smartphones, folding devices, AI camera powerhouses, and reliable daily drivers.",
    subcategories: [
      { id: "sub-2-1", name: "Flagship 5G Smartphones", slug: "flagship-smartphones" },
      { id: "sub-2-2", name: "Mid-Range Smartphones", slug: "mid-range-smartphones" },
      { id: "sub-2-3", name: "Budget Smartphones", slug: "budget-smartphones" },
      { id: "sub-2-4", name: "Foldable & Flip Phones", slug: "foldable-smartphones" },
      { id: "sub-2-5", name: "Gaming Phones", slug: "gaming-smartphones" },
    ],
  },
  {
    id: "cat-3",
    name: "Laptops",
    slug: "laptops",
    icon: "Laptop",
    bannerImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    description: "Performance gaming rigs, featherweight ultrabooks, enterprise workstations, and 2-in-1 convertibles.",
    subcategories: [
      { id: "sub-3-1", name: "Ultrabooks & Thin Laptops", slug: "ultrabooks" },
      { id: "sub-3-2", name: "Gaming Laptops", slug: "gaming-laptops" },
      { id: "sub-3-3", name: "Business & Enterprise Laptops", slug: "business-laptops" },
      { id: "sub-3-4", name: "Student & Everyday Laptops", slug: "student-laptops" },
      { id: "sub-3-5", name: "2-in-1 Convertible Laptops", slug: "convertible-laptops" },
      { id: "sub-3-6", name: "Workstations & Creator Laptops", slug: "workstations" },
    ],
  },
  {
    id: "cat-4",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    bannerImage: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1200&q=80",
    description: "Trendsetting apparel, authentic denim, tailored shirts, elegant ethnic wear, and luxury staples.",
    subcategories: [
      { id: "sub-4-1", name: "Men's Shirts & Polos", slug: "mens-shirts-polos" },
      { id: "sub-4-2", name: "Men's Trousers & Chinos", slug: "mens-trousers" },
      { id: "sub-4-3", name: "Women's Western Dresses", slug: "womens-dresses" },
      { id: "sub-4-4", name: "Women's Ethnic Kurtas & Sarees", slug: "womens-ethnic" },
      { id: "sub-4-5", name: "Denim Jeans & Jackets", slug: "denim-jackets" },
      { id: "sub-4-6", name: "Winterwear & Hoodies", slug: "winterwear-hoodies" },
    ],
  },
  {
    id: "cat-5",
    name: "Shoes",
    slug: "shoes",
    icon: "ShoppingBag",
    bannerImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    description: "Engineered marathon running shoes, iconic street sneakers, leather formal shoes, and training kicks.",
    subcategories: [
      { id: "sub-5-1", name: "Running & Jogging Shoes", slug: "running-shoes" },
      { id: "sub-5-2", name: "Casual Sneakers", slug: "casual-sneakers" },
      { id: "sub-5-3", name: "Formal Oxford & Derby Shoes", slug: "formal-shoes" },
      { id: "sub-5-4", name: "Sports & Training Shoes", slug: "sports-training-shoes" },
      { id: "sub-5-5", name: "Loafers & Slip-Ons", slug: "loafers-slip-ons" },
      { id: "sub-5-6", name: "Sandals & Slides", slug: "sandals-slides" },
    ],
  },
  {
    id: "cat-6",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: "Home",
    bannerImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80",
    description: "Premium tri-ply cookware, smart air fryers, powerful mixer grinders, and modern home essentials.",
    subcategories: [
      { id: "sub-6-1", name: "Cookware & Non-Stick Sets", slug: "cookware-sets" },
      { id: "sub-6-2", name: "Kitchen Appliances", slug: "kitchen-appliances" },
      { id: "sub-6-3", name: "Mixer Grinders & Juicers", slug: "mixers-juicers" },
      { id: "sub-6-4", name: "Air Fryers & Ovens", slug: "air-fryers-ovens" },
      { id: "sub-6-5", name: "Vacuum Cleaners & Purifiers", slug: "cleaners-purifiers" },
      { id: "sub-6-6", name: "Dinnerware & Dining", slug: "dinnerware-dining" },
    ],
  },
  {
    id: "cat-7",
    name: "Beauty",
    slug: "beauty",
    icon: "Sparkles",
    bannerImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
    description: "Dermatologist-tested skincare, radiant makeup cosmetics, luxury fragrances, and salon hair care.",
    subcategories: [
      { id: "sub-7-1", name: "Skincare & Serums", slug: "skincare-serums" },
      { id: "sub-7-2", name: "Makeup & Foundations", slug: "makeup-cosmetics" },
      { id: "sub-7-3", name: "Hair Care & Shampoos", slug: "haircare-styling" },
      { id: "sub-7-4", name: "Luxury Fragrances & Perfumes", slug: "fragrances-perfumes" },
      { id: "sub-7-5", name: "Sunscreens & Lotions", slug: "sunscreen-bodycare" },
      { id: "sub-7-6", name: "Men's Grooming & Beard Care", slug: "mens-grooming" },
    ],
  },
  {
    id: "cat-8",
    name: "Sports",
    slug: "sports",
    icon: "Dumbbell",
    bannerImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80",
    description: "Pro graphite rackets, FIFA-grade footballs, heavy-duty gym weights, cricket bats, and yoga gear.",
    subcategories: [
      { id: "sub-8-1", name: "Gym Equipment & Dumbbells", slug: "gym-equipment" },
      { id: "sub-8-2", name: "Badminton & Tennis Rackets", slug: "badminton-tennis" },
      { id: "sub-8-3", name: "Footballs & Basketballs", slug: "balls-sports-gear" },
      { id: "sub-8-4", name: "Cricket Bats & Protection", slug: "cricket-gear" },
      { id: "sub-8-5", name: "Yoga Mats & Resistance Bands", slug: "yoga-fitness" },
      { id: "sub-8-6", name: "Athletic Apparel & Tracksuits", slug: "athletic-sportswear" },
    ],
  },
  {
    id: "cat-9",
    name: "Books",
    slug: "books",
    icon: "BookOpen",
    bannerImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80",
    description: "Bestselling global fiction, tech engineering guides, transformative business books, and classics.",
    subcategories: [
      { id: "sub-9-1", name: "Fiction & Novels", slug: "fiction-novels" },
      { id: "sub-9-2", name: "Non-Fiction & Biographies", slug: "non-fiction-biographies" },
      { id: "sub-9-3", name: "Business & Finance", slug: "business-finance" },
      { id: "sub-9-4", name: "Self-Help & Personal Growth", slug: "self-help" },
      { id: "sub-9-5", name: "Science & Technology", slug: "science-technology" },
      { id: "sub-9-6", name: "Children & Young Adult", slug: "children-books" },
    ],
  },
  {
    id: "cat-10",
    name: "Toys",
    slug: "toys",
    icon: "Baby",
    bannerImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80",
    description: "LEGO architecture sets, precision RC vehicles, STEM robotics kits, strategy board games, and dolls.",
    subcategories: [
      { id: "sub-10-1", name: "Building Blocks & LEGO", slug: "building-blocks" },
      { id: "sub-10-2", name: "Action Figures & Collectibles", slug: "action-figures" },
      { id: "sub-10-3", name: "Board Games & Puzzles", slug: "board-games-puzzles" },
      { id: "sub-10-4", name: "Remote Control Vehicles", slug: "rc-vehicles" },
      { id: "sub-10-5", name: "STEM & Educational Kits", slug: "stem-educational" },
      { id: "sub-10-6", name: "Dolls & Playsets", slug: "dolls-playsets" },
    ],
  },
  {
    id: "cat-11",
    name: "Accessories",
    slug: "accessories",
    icon: "Headphones",
    bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
    description: "Military-grade phone cases, GaN fast chargers, magnetic power banks, smartwatch bands, and cables.",
    subcategories: [
      { id: "sub-11-1", name: "Phone Cases & Screen Protectors", slug: "phone-cases-covers" },
      { id: "sub-11-2", name: "Fast Chargers & Cables", slug: "chargers-cables" },
      { id: "sub-11-3", name: "Wireless Power Banks", slug: "power-banks" },
      { id: "sub-11-4", name: "Smartwatch Straps & Bands", slug: "smartwatch-straps" },
      { id: "sub-11-5", name: "Laptop Sleeves & Backpacks", slug: "laptop-sleeves-bags" },
      { id: "sub-11-6", name: "Earbud Cases & Audio Cables", slug: "earbud-accessories" },
    ],
  },
];
