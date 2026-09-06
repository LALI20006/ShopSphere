import { Router } from "express";
import { DataStore } from "../services/store.js";

const router = Router();
const store = DataStore.getInstance();

// POST /api/v1/coupons/validate
router.post("/validate", (req, res) => {
  try {
    const { code, cartAmount } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const coupon = store.getCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code. Try WELCOME10, SHOP20, or SAVE500." });
    }

    const subtotal = Number(cartAmount || 0);
    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        error: `Coupon '${coupon.code}' requires a minimum cart value of ₹${coupon.minOrderAmount.toLocaleString("en-IN")}`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      description: coupon.description,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to validate coupon" });
  }
});

export default router;
