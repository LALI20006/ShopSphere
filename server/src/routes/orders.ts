import { Router } from "express";
import { DataStore } from "../services/store.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
const store = DataStore.getInstance();

// POST /api/v1/orders - Place a new order
router.post("/", authenticate, (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, deliverySpeed, paymentMethod, couponCode } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    let totalOriginal = 0;
    for (const item of items) {
      const prod = store.getProductByIdOrSlug(item.productId);
      if (!prod) {
        return res.status(400).json({ error: `Product ${item.name || item.productId} no longer exists` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ error: `Only ${prod.stock} units available for ${prod.name}` });
      }
      subtotal += prod.price * item.quantity;
      totalOriginal += prod.originalPrice * item.quantity;
    }

    const discount = totalOriginal - subtotal;
    const deliveryFee = deliverySpeed === "express" ? 99 : subtotal >= 499 ? 0 : 49;

    let couponDiscount = 0;
    if (couponCode) {
      const coupon = store.getCouponByCode(couponCode);
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === "percentage") {
          couponDiscount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        } else {
          couponDiscount = coupon.discountValue;
        }
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - couponDiscount);
    const estimatedDays = deliverySpeed === "express" ? 2 : 4;
    const estimatedDelivery = new Date(Date.now() + estimatedDays * 86400000).toISOString();

    const order = store.createOrder({
      userId: req.user!.id,
      userEmail: req.user!.email,
      userName: req.user!.name,
      items,
      shippingAddress,
      deliverySpeed: deliverySpeed || "standard",
      deliveryFee,
      subtotal,
      discount,
      couponCode,
      couponDiscount,
      total,
      paymentMethod: paymentMethod || "demo",
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      orderStatus: "Ordered",
      estimatedDelivery,
    });

    return res.status(201).json({ order });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create order" });
  }
});

// GET /api/v1/orders - Get current user's orders
router.get("/", authenticate, (req: AuthRequest, res) => {
  try {
    const orders = store.getOrdersByUserId(req.user!.id);
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch orders" });
  }
});

// GET /api/v1/orders/:id - Get order details and tracking
router.get("/:id", authenticate, (req: AuthRequest, res) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure user can only view their own order unless admin
    if (order.userId !== req.user!.id && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json({ order });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch order details" });
  }
});

// POST /api/v1/orders/:id/cancel - Cancel order
router.post("/:id/cancel", authenticate, (req: AuthRequest, res) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== req.user!.id && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ error: "Delivered orders cannot be cancelled" });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    const updated = store.updateOrderStatus(order.id, "Cancelled");
    return res.json({ order: updated, message: "Order cancelled successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to cancel order" });
  }
});

export default router;
