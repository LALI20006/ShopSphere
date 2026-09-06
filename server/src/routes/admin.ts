import { Router } from "express";
import { DataStore } from "../services/store.js";
import { requireAdmin, AuthRequest } from "../middleware/auth.js";
import { OrderStatus } from "../models/Order.js";

const router = Router();
const store = DataStore.getInstance();

// All routes in /admin require admin role
router.use(requireAdmin);

// GET /api/v1/admin/analytics
router.get("/analytics", (req: AuthRequest, res) => {
  try {
    const analytics = store.getAdminAnalytics();
    return res.json({ analytics });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch analytics" });
  }
});

// GET /api/v1/admin/orders
router.get("/orders", (req: AuthRequest, res) => {
  try {
    const orders = store.getAllOrders();
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch orders" });
  }
});

// PUT /api/v1/admin/orders/:id/status
router.put("/orders/:id/status", (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = [
      "Ordered",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid order status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = store.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ order: updated, message: `Order status updated to ${status}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update order status" });
  }
});

// POST /api/v1/admin/products
router.post("/products", (req: AuthRequest, res) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      description,
      shortDescription,
      price,
      originalPrice,
      stock,
      images,
      specifications,
      features,
      colors,
      sizes,
    } = req.body;

    if (!name || !brand || !category || !price) {
      return res.status(400).json({ error: "Product name, brand, category, and price are required" });
    }

    const numPrice = Number(price);
    const numOriginal = Number(originalPrice || price);
    const discount = numOriginal > numPrice ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 0;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProduct = store.addProduct({
      name,
      slug,
      brand,
      category,
      subcategory: subcategory || category,
      description: description || name,
      shortDescription: shortDescription || description || name,
      price: numPrice,
      originalPrice: numOriginal,
      discountPercent: discount,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(stock || 10),
      sku: `${brand.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      images: Array.isArray(images) && images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
      ],
      specifications: specifications || { "Brand": brand, "Category": category },
      features: Array.isArray(features) ? features : ["Premium authentic quality", "ShopSphere Certified"],
      colors,
      sizes,
      deliveryDays: 2,
      freeDelivery: numPrice >= 499,
      seller: "ShopSphere Direct Retail",
      tags: [category, brand.toLowerCase()],
      isFeatured: false,
      isDealOfDay: false,
    });

    return res.status(201).json({ product: newProduct });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create product" });
  }
});

// PUT /api/v1/admin/products/:id
router.put("/products/:id", (req: AuthRequest, res) => {
  try {
    const updated = store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ product: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update product" });
  }
});

// DELETE /api/v1/admin/products/:id
router.delete("/products/:id", (req: AuthRequest, res) => {
  try {
    const success = store.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete product" });
  }
});

export default router;
