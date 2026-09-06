import { Router } from "express";
import { DataStore } from "../services/store.js";
import { ProductFilterQuery } from "../models/Product.js";

const router = Router();
const store = DataStore.getInstance();

// GET /api/v1/products/categories
router.get("/categories", (req, res) => {
  try {
    const categories = store.getCategories();
    return res.json({ categories });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch categories" });
  }
});

// GET /api/v1/products/search/suggestions
router.get("/search/suggestions", (req, res) => {
  try {
    const q = req.query.q as string;
    const suggestions = store.getSearchSuggestions(q || "");
    return res.json({ suggestions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to get suggestions" });
  }
});

// GET /api/v1/products/deals
router.get("/deals", (req, res) => {
  try {
    const limit = Number(req.query.limit || 16);
    const deals = store.getDeals(limit);
    return res.json({ deals });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to get deals" });
  }
});

// GET /api/v1/products/featured
router.get("/featured", (req, res) => {
  try {
    const limit = Number(req.query.limit || 12);
    const featured = store.getFeaturedProducts(limit);
    return res.json({ featured });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to get featured products" });
  }
});

// GET /api/v1/products
router.get("/", (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      hasDiscount,
      sort,
      page,
      limit,
    } = req.query;

    const query: ProductFilterQuery = {
      category: category as string,
      subcategory: subcategory as string,
      search: search as string,
      brand: brand ? (Array.isArray(brand) ? (brand as string[]) : (brand as string).split(",")) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      inStock: inStock === "true" || inStock === "1",
      hasDiscount: hasDiscount === "true" || hasDiscount === "1",
      sort: sort as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 16,
    };

    const result = store.getProducts(query);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});

// GET /api/v1/products/:idOrSlug
router.get("/:idOrSlug", (req, res) => {
  try {
    const product = store.getProductByIdOrSlug(req.params.idOrSlug);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ product });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch product" });
  }
});

// GET /api/v1/products/:id/related
router.get("/:id/related", (req, res) => {
  try {
    const limit = Number(req.query.limit || 8);
    const related = store.getRelatedProducts(req.params.id, limit);
    return res.json({ related });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch related products" });
  }
});

export default router;
