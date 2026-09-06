import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Product, ProductFilterQuery } from "../models/Product.js";
import { User, Address, SafeUser } from "../models/User.js";
import { Order, OrderStatus, TrackingStep } from "../models/Order.js";
import { Review, Coupon } from "../models/Review.js";
import { CATEGORIES, Category } from "../data/categories.js";
import { SEED_PRODUCTS } from "../data/seedProducts.js";
import { generateCompleteCatalog } from "../data/generators/index.js";

const DATA_DIR = fs.existsSync(path.resolve(process.cwd(), "data"))
  ? path.resolve(process.cwd(), "data")
  : path.resolve(process.cwd(), "server", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
}

export class DataStore {
  private static instance: DataStore;
  private data: DatabaseSchema = {
    products: [],
    categories: [],
    users: [],
    orders: [],
    reviews: [],
    coupons: [],
  };
  private passwordResetCodes: Map<string, { code: string; expiresAt: number }> = new Map();

  // Fast In-Memory Index Maps for High-Performance Querying
  private productsById: Map<string, Product> = new Map();
  private productsBySlug: Map<string, Product> = new Map();
  private productsByCategory: Map<string, Product[]> = new Map();
  private productsBySubcategory: Map<string, Product[]> = new Map();

  private constructor() {
    this.init();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      // Safely ignore directory creation in read-only serverless filesystems
    }

    // 1. Load dynamic data (Users, Orders, Reviews, Coupons) from db.json
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        this.data.categories = CATEGORIES;
        this.data.users = Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : [];
        this.data.orders = Array.isArray(parsed.orders) && parsed.orders.length > 0 ? parsed.orders : [];
        this.data.reviews = Array.isArray(parsed.reviews) && parsed.reviews.length > 0 ? parsed.reviews : [];
        this.data.coupons = Array.isArray(parsed.coupons) && parsed.coupons.length > 0 ? parsed.coupons : [];
      } catch (err) {
        console.error("Error reading db.json, re-seeding default dynamic state:", err);
        this.seedDefaults();
      }
    } else {
      this.seedDefaults();
    }

    if (!this.data.users || this.data.users.length === 0) {
      this.seedDefaults();
    }

    // 2. Load large product catalog (products.json)
    if (fs.existsSync(PRODUCTS_FILE)) {
      try {
        const rawProducts = fs.readFileSync(PRODUCTS_FILE, "utf-8");
        this.data.products = JSON.parse(rawProducts);
        console.log(`[DataStore] Loaded ${this.data.products.length} products from products.json`);
      } catch (err) {
        console.error("Error reading products.json, generating catalog fallback:", err);
        this.data.products = generateCompleteCatalog();
        this.persistProducts();
      }
    } else {
      console.log("[DataStore] products.json not found, generating complete catalog...");
      this.data.products = generateCompleteCatalog();
      this.persistProducts();
    }

    this.rebuildIndexes();
    this.persist();
  }

  private addToMultiMap(map: Map<string, Product[]>, key: string, product: Product) {
    const k = key.trim().toLowerCase();
    if (!k) return;
    let list = map.get(k);
    if (!list) {
      list = [];
      map.set(k, list);
    }
    if (!list.some((p) => p.id === product.id)) {
      list.push(product);
    }
  }

  private rebuildIndexes() {
    this.productsById.clear();
    this.productsBySlug.clear();
    this.productsByCategory.clear();
    this.productsBySubcategory.clear();

    for (const p of this.data.products) {
      this.productsById.set(p.id, p);
      if (p.slug) {
        this.productsBySlug.set(p.slug.toLowerCase(), p);
      }

      // Index by category name and known category slug / id
      const catName = p.category.toLowerCase().trim();
      this.addToMultiMap(this.productsByCategory, catName, p);
      const catObj = CATEGORIES.find(
        (c) => c.name.toLowerCase() === catName || c.slug.toLowerCase() === catName
      );
      if (catObj) {
        this.addToMultiMap(this.productsByCategory, catObj.slug.toLowerCase(), p);
        this.addToMultiMap(this.productsByCategory, catObj.id.toLowerCase(), p);
      }

      // Index by subcategory name and known subcategory slug / id
      const subName = p.subcategory.toLowerCase().trim();
      this.addToMultiMap(this.productsBySubcategory, subName, p);
      for (const c of CATEGORIES) {
        const subObj = c.subcategories.find(
          (s) => s.name.toLowerCase() === subName || s.slug.toLowerCase() === subName
        );
        if (subObj) {
          this.addToMultiMap(this.productsBySubcategory, subObj.slug.toLowerCase(), p);
          this.addToMultiMap(this.productsBySubcategory, subObj.id.toLowerCase(), p);
          break;
        }
      }
    }
  }

  private seedDefaults() {
    // Seed Coupons
    const defaultCoupons: Coupon[] = [
      {
        id: "coup-1",
        code: "WELCOME10",
        description: "10% Instant Discount on first order",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 499,
        maxDiscount: 1500,
        expiresAt: "2027-12-31T23:59:59Z",
        isActive: true,
      },
      {
        id: "coup-2",
        code: "SHOP20",
        description: "20% Super Saver on orders above ₹1999",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 1999,
        maxDiscount: 2500,
        expiresAt: "2027-12-31T23:59:59Z",
        isActive: true,
      },
      {
        id: "coup-3",
        code: "SAVE500",
        description: "Flat ₹500 Off on orders above ₹2499",
        discountType: "fixed",
        discountValue: 500,
        minOrderAmount: 2499,
        expiresAt: "2027-12-31T23:59:59Z",
        isActive: true,
      },
    ];

    // Hash default passwords for demo accounts
    const salt = bcrypt.genSaltSync(10);
    const userHash = bcrypt.hashSync("password123", salt);
    const adminHash = bcrypt.hashSync("admin123", salt);

    const defaultUsers: User[] = [
      {
        id: "usr-demo-01",
        name: "Rahul Sharma",
        email: "user@shopsphere.com",
        passwordHash: userHash,
        phone: "+91 98765 43210",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        addresses: [
          {
            id: "addr-01",
            fullName: "Rahul Sharma",
            phone: "+91 98765 43210",
            houseFlat: "Flat 402, Highline Residency",
            street: "Linking Road, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400050",
            landmark: "Near Bandra Police Station",
            isDefault: true,
            addressType: "Home",
          },
          {
            id: "addr-02",
            fullName: "Rahul Sharma (Office)",
            phone: "+91 98765 43210",
            houseFlat: "Tower B, 7th Floor, Mindspace Tech Park",
            street: "Malad West",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400064",
            landmark: "Behind Inorbit Mall",
            isDefault: false,
            addressType: "Work",
          },
        ],
        wishlist: ["mc-01", "tv-03", "wf-01"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-admin-01",
        name: "ShopSphere Admin",
        email: "admin@shopsphere.com",
        passwordHash: adminHash,
        phone: "+91 99999 88888",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed Sample Reviews
    const defaultReviews: Review[] = [
      {
        id: "rev-01",
        productId: "mc-01",
        userId: "usr-demo-01",
        userName: "Rahul Sharma",
        rating: 5,
        title: "Spectacular phone! The titanium feel is out of this world.",
        comment: "Upgraded from an iPhone 12 and the difference is massive. The camera in low light is mind-blowing, and the natural titanium finish is super light and premium. Battery easily lasts 1.5 days.",
        isVerifiedPurchase: true,
        helpfulVotes: 42,
        createdAt: "2026-02-01T14:30:00Z",
      },
      {
        id: "rev-02",
        productId: "tv-03",
        userId: "usr-demo-01",
        userName: "Rahul Sharma",
        rating: 5,
        title: "Best ANC in the game. Pure silence.",
        comment: "Used them on a flight to London and could not hear the engine noise at all. Soundstage is crystal clear and calls are crisp. Super comfortable for long sessions.",
        isVerifiedPurchase: true,
        helpfulVotes: 28,
        createdAt: "2026-02-04T09:15:00Z",
      },
    ];

    // Seed Initial Demo Order
    const defaultOrders: Order[] = [
      {
        id: "ord-sample-101",
        orderNumber: "SPH-2026-9812",
        userId: "usr-demo-01",
        userEmail: "user@shopsphere.com",
        userName: "Rahul Sharma",
        items: [
          {
            productId: "tv-03",
            name: "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            price: 27990,
            originalPrice: 34990,
            quantity: 1,
            selectedColor: "Silver",
          },
        ],
        shippingAddress: defaultUsers[0].addresses[0],
        deliverySpeed: "standard",
        deliveryFee: 0,
        subtotal: 27990,
        discount: 7000,
        couponCode: "WELCOME10",
        couponDiscount: 1500,
        total: 26490,
        paymentMethod: "upi",
        paymentStatus: "Paid",
        orderStatus: "Shipped",
        estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
        trackingHistory: [
          { status: "Ordered", date: "2026-02-10T10:30:00Z", completed: true, current: false, description: "Order placed successfully." },
          { status: "Confirmed", date: "2026-02-10T11:00:00Z", completed: true, current: false, description: "Payment verified by bank." },
          { status: "Packed", date: "2026-02-10T16:45:00Z", completed: true, current: false, description: "Package inspected & packed at ShopSphere Hub Mumbai." },
          { status: "Shipped", date: "2026-02-11T08:20:00Z", completed: true, current: true, description: "Dispatched with BlueDart Logistics (Air Express)." },
          { status: "Out for Delivery", date: "", completed: false, current: false, description: "Assigned to delivery courier." },
          { status: "Delivered", date: "", completed: false, current: false, description: "Delivered to recipient." },
        ],
        createdAt: "2026-02-10T10:30:00Z",
        updatedAt: "2026-02-11T08:20:00Z",
      },
    ];

    this.data = {
      products: this.data.products.length > 0 ? this.data.products : SEED_PRODUCTS,
      categories: CATEGORIES,
      users: defaultUsers,
      orders: defaultOrders,
      reviews: defaultReviews,
      coupons: defaultCoupons,
    };
  }

  private persist() {
    if (process.env.VERCEL) return;
    try {
      const dbPayload = {
        categories: this.data.categories,
        users: this.data.users,
        orders: this.data.orders,
        reviews: this.data.reviews,
        coupons: this.data.coupons,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(dbPayload, null, 2), "utf-8");
    } catch (err) {
      // In read-only serverless environments, ignore
    }
  }

  private persistProducts() {
    if (!process.env.VERCEL) {
      try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(this.data.products, null, 2), "utf-8");
      } catch (err) {
        // In read-only serverless environments, catalog is safely kept in-memory
      }
    }
    this.rebuildIndexes();
  }

  // --- Products ---
  public getProducts(query: ProductFilterQuery): { products: Product[]; total: number; page: number; totalPages: number } {
    let result: Product[];

    // Fast indexed start
    if (query.subcategory) {
      const subKey = query.subcategory.trim().toLowerCase();
      const indexed = this.productsBySubcategory.get(subKey);
      result = indexed ? [...indexed] : [];
      // Fallback if not matching exact index key
      if (result.length === 0) {
        result = this.data.products.filter(
          (p) => p.subcategory.toLowerCase() === subKey || p.subcategory.toLowerCase().includes(subKey)
        );
      }
    } else if (query.category) {
      const catKey = query.category.trim().toLowerCase();
      const indexed = this.productsByCategory.get(catKey);
      result = indexed ? [...indexed] : [];
      if (result.length === 0) {
        result = this.data.products.filter(
          (p) => p.category.toLowerCase() === catKey || p.category.toLowerCase().includes(catKey)
        );
      }
    } else {
      result = [...this.data.products];
    }

    // Brand filter
    if (query.brand) {
      const brands = (Array.isArray(query.brand) ? query.brand : [query.brand]).flatMap((b) =>
        b.split(",").map((s) => s.trim().toLowerCase())
      );
      result = result.filter((p) => brands.includes(p.brand.toLowerCase()));
    }

    // Search query
    if (query.search) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Price bounds
    if (query.minPrice !== undefined) {
      const min = Number(query.minPrice);
      result = result.filter((p) => p.price >= min);
    }
    if (query.maxPrice !== undefined) {
      const max = Number(query.maxPrice);
      result = result.filter((p) => p.price <= max);
    }

    // Rating
    if (query.rating !== undefined) {
      const minRating = Number(query.rating);
      result = result.filter((p) => p.rating >= minRating);
    }

    // In stock
    if (query.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Has discount
    if (query.hasDiscount) {
      result = result.filter((p) => p.discountPercent > 0);
    }

    // Sorting
    const sort = query.sort || "featured";
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "best-selling":
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewsCount - a.reviewsCount);
        break;
      case "discount":
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    const total = result.length;
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Number(query.limit || 24));
    const totalPages = Math.ceil(total / limit);
    const paginated = result.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      total,
      page,
      totalPages,
    };
  }

  public getProductByIdOrSlug(identifier: string): Product | undefined {
    const clean = identifier.trim();
    const fromId = this.productsById.get(clean);
    if (fromId) return fromId;

    const fromSlug = this.productsBySlug.get(clean.toLowerCase());
    if (fromSlug) return fromSlug;

    return this.data.products.find((p) => p.id === identifier || p.slug === identifier);
  }

  public getSearchSuggestions(query: string): { name: string; brand: string; category: string; slug: string }[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const matches: { name: string; brand: string; category: string; slug: string }[] = [];

    for (const p of this.data.products) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ) {
        matches.push({
          name: p.name,
          brand: p.brand,
          category: p.category,
          slug: p.slug,
        });
        if (matches.length >= 8) break;
      }
    }
    return matches;
  }

  public getRelatedProducts(productId: string, limit = 8): Product[] {
    const current = this.getProductByIdOrSlug(productId);
    if (!current) return this.data.products.slice(0, limit);

    const subList = this.productsBySubcategory.get(current.subcategory.toLowerCase().trim()) || [];
    const related = subList.filter((p) => p.id !== current.id);
    if (related.length >= limit) return related.slice(0, limit);

    const catList = this.productsByCategory.get(current.category.toLowerCase().trim()) || [];
    const combined = [...related, ...catList.filter((p) => p.id !== current.id && !related.some((r) => r.id === p.id))];
    return combined.slice(0, limit);
  }

  public getDeals(limit = 12): Product[] {
    const deals: Product[] = [];
    for (const p of this.data.products) {
      if (p.discountPercent >= 20 || p.isDealOfDay) {
        deals.push(p);
      }
    }
    return deals.sort((a, b) => b.discountPercent - a.discountPercent).slice(0, limit);
  }

  public getFeaturedProducts(limit = 12): Product[] {
    const featured: Product[] = [];
    for (const p of this.data.products) {
      if (p.isFeatured || p.isBestSeller) {
        featured.push(p);
      }
      if (featured.length >= limit * 2) break;
    }
    return featured.slice(0, limit);
  }

  public addProduct(product: Omit<Product, "id" | "createdAt">): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-custom-${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.persistProducts();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persistProducts();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persistProducts();
      return true;
    }
    return false;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.data.categories;
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserByIdentifier(identifier: string): User | undefined {
    const clean = identifier.toLowerCase().trim();
    return this.data.users.find((u) => {
      if (u.email.toLowerCase() === clean) return true;
      if (u.phone && u.phone.trim().toLowerCase() === clean) return true;
      const digits = clean.replace(/\D/g, "");
      if (digits.length >= 10 && u.phone) {
        const uDigits = u.phone.replace(/\D/g, "");
        if (uDigits.endsWith(digits) || digits.endsWith(uDigits)) return true;
      }
      return false;
    });
  }

  public setUserPassword(email: string, newPasswordHash: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    this.persist();
    return true;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: Omit<User, "id" | "createdAt" | "addresses" | "wishlist">): SafeUser {
    const newUser: User = {
      ...user,
      id: `usr-${uuidv4().slice(0, 8)}`,
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    const { passwordHash, ...safe } = newUser;
    return safe;
  }

  public updateUser(id: string, updates: Partial<User>): SafeUser | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    const { passwordHash, ...safe } = this.data.users[idx];
    return safe;
  }

  public createPasswordResetCode(email: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    this.passwordResetCodes.set(email.toLowerCase().trim(), { code, expiresAt });
    return code;
  }

  public verifyPasswordResetCode(email: string, code: string): boolean {
    const record = this.passwordResetCodes.get(email.toLowerCase().trim());
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.passwordResetCodes.delete(email.toLowerCase().trim());
      return false;
    }
    return record.code === code.trim();
  }

  public resetUserPassword(email: string, code: string, newPasswordHash: string): boolean {
    if (!this.verifyPasswordResetCode(email, code)) {
      return false;
    }
    const user = this.findUserByEmail(email);
    if (!user) return false;

    user.passwordHash = newPasswordHash;
    this.passwordResetCodes.delete(email.toLowerCase().trim());
    this.persist();
    return true;
  }

  public addAddress(userId: string, address: Omit<Address, "id">): Address | null {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return null;
    const newAddress: Address = {
      ...address,
      id: `addr-${uuidv4().slice(0, 8)}`,
    };
    if (newAddress.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((a) => (a.isDefault = false));
      newAddress.isDefault = true;
    }
    user.addresses.push(newAddress);
    this.persist();
    return newAddress;
  }

  public updateAddress(userId: string, addressId: string, updates: Partial<Address>): Address | null {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return null;
    const addrIdx = user.addresses.findIndex((a) => a.id === addressId);
    if (addrIdx === -1) return null;

    if (updates.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses[addrIdx] = { ...user.addresses[addrIdx], ...updates };
    this.persist();
    return user.addresses[addrIdx];
  }

  public deleteAddress(userId: string, addressId: string): boolean {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return false;
    const prevLen = user.addresses.length;
    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    if (user.addresses.length !== prevLen) {
      if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }
      this.persist();
      return true;
    }
    return false;
  }

  public toggleWishlist(userId: string, productId: string): string[] {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return [];
    if (!user.wishlist) user.wishlist = [];

    const idx = user.wishlist.indexOf(productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    this.persist();
    return user.wishlist;
  }

  // --- Orders ---
  public createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "trackingHistory">): Order {
    const orderNumber = `SPH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const trackingHistory: TrackingStep[] = [
      { status: "Ordered", date: now, completed: true, current: true, description: "Order received & payment confirmed." },
      { status: "Confirmed", date: "", completed: false, current: false, description: "Seller confirmed order inventory." },
      { status: "Packed", date: "", completed: false, current: false, description: "Item packed and labeled for dispatch." },
      { status: "Shipped", date: "", completed: false, current: false, description: "In transit with courier." },
      { status: "Out for Delivery", date: "", completed: false, current: false, description: "Delivery agent is arriving at your doorstep." },
      { status: "Delivered", date: "", completed: false, current: false, description: "Order delivered safely." },
    ];

    const newOrder: Order = {
      ...orderData,
      id: `ord-${uuidv4().slice(0, 10)}`,
      orderNumber,
      trackingHistory,
      createdAt: now,
      updatedAt: now,
    };

    // Decrement stock for ordered items
    for (const item of newOrder.items) {
      const prod = this.data.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public getOrdersByUserId(userId: string): Order[] {
    return this.data.orders.filter((o) => o.userId === userId);
  }

  public getAllOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    const sequence: OrderStatus[] = ["Ordered", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    const targetIdx = sequence.indexOf(status);

    if (targetIdx !== -1) {
      order.trackingHistory = sequence.map((s, idx) => ({
        status: s,
        date: idx <= targetIdx ? (order.trackingHistory[idx]?.date || new Date().toISOString()) : "",
        completed: idx <= targetIdx,
        current: idx === targetIdx,
        description: order.trackingHistory[idx]?.description || `${s} status reached.`,
      }));
    } else if (status === "Cancelled") {
      order.trackingHistory.push({
        status: "Cancelled",
        date: new Date().toISOString(),
        completed: true,
        current: true,
        description: "Order was cancelled.",
      });
    }

    this.persist();
    return order;
  }

  // --- Reviews ---
  public getReviewsByProductId(productId: string): Review[] {
    return this.data.reviews.filter((r) => r.productId === productId);
  }

  public addReview(review: Omit<Review, "id" | "createdAt" | "helpfulVotes">): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${uuidv4().slice(0, 8)}`,
      helpfulVotes: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.unshift(newReview);

    // Recalculate product rating and reviewsCount
    const prodReviews = this.data.reviews.filter((r) => r.productId === review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.data.products.find((p) => p.id === review.productId);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewsCount = prodReviews.length;
    }

    this.persist();
    return newReview;
  }

  // --- Coupons ---
  public getCouponByCode(code: string): Coupon | undefined {
    return this.data.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  }

  // --- Admin Analytics ---
  public getAdminAnalytics() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + o.total, 0);
    const totalProducts = this.data.products.length;
    const totalCategories = this.data.categories.length;
    const totalSubcategories = this.data.categories.reduce(
      (sum, c) => sum + (c.subcategories ? c.subcategories.length : 0),
      0
    );
    const totalUsers = this.data.users.length;
    const lowStockProducts = this.data.products.filter((p) => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = this.data.products.filter((p) => p.stock === 0);

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCategories,
      totalSubcategories,
      totalUsers,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      recentOrders: this.data.orders.slice(0, 5),
      lowStockProducts: lowStockProducts.slice(0, 8),
    };
  }
}
