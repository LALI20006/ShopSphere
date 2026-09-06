import { Router } from "express";
import { DataStore } from "../services/store.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
const store = DataStore.getInstance();

// GET /api/v1/reviews/product/:productId
router.get("/product/:productId", (req, res) => {
  try {
    const reviews = store.getReviewsByProductId(req.params.productId);
    return res.json({ reviews });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch reviews" });
  }
});

// POST /api/v1/reviews - Submit review
router.post("/", authenticate, (req: AuthRequest, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: "Product ID, rating, and comment are required" });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user has ordered this product to flag verified purchase
    const userOrders = store.getOrdersByUserId(req.user!.id);
    const hasPurchased = userOrders.some((o) =>
      o.items.some((i) => i.productId === productId)
    );

    const review = store.addReview({
      productId,
      userId: req.user!.id,
      userName: req.user!.name,
      userAvatar: req.user!.avatar,
      rating: numRating,
      title: title || "Customer Review",
      comment,
      isVerifiedPurchase: hasPurchased,
    });

    return res.status(201).json({ review });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to add review" });
  }
});

export default router;
