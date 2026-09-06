import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import couponRoutes from "./routes/coupons.js";
import adminRoutes from "./routes/admin.js";
import { DataStore } from "./services/store.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize data store
const store = DataStore.getInstance();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "ShopSphere API",
    version: "1.0.0",
    time: new Date().toISOString(),
    totalProducts: store.getProducts({}).total,
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/admin", adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 ShopSphere Server running at http://localhost:${PORT}`);
    console.log(`📦 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🛍️ Products Catalog: ${store.getProducts({}).total} items seeded`);
    console.log(`===============================================`);
  });
}

export default app;
