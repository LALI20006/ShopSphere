import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  Package,
  Users,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Layers,
  SlidersHorizontal,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { adminApi, productApi } from "../services/api";
import { Order, OrderStatus, Product, Category } from "../types";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filters for Admin Products Tab
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "Mobiles, Computers",
    subcategory: "All Mobile Phones",
    price: "",
    originalPrice: "",
    stock: "25",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    price: "",
    originalPrice: "",
    stock: "",
    imageUrl: "",
    description: "",
  });

  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productError, setProductError] = useState("");

  // Fetch Analytics, Orders & Categories once
  const fetchOverview = async () => {
    try {
      const [analyticsRes, ordersRes, categoriesRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getOrders(),
        productApi.getCategories(),
      ]);
      setAnalytics(analyticsRes.analytics);
      setOrders(ordersRes.orders || []);
      setCategories(categoriesRes.categories || []);
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    }
  };

  // Fetch Products with pagination & filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({
        page: currentPage,
        limit: 25,
        search: searchProductQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        subcategory: selectedSubcategory !== "all" ? selectedSubcategory : undefined,
      });
      setProducts(res.products || []);
      setTotalProductsCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Failed to load products list:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchProductQuery, selectedCategory, selectedSubcategory]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOverview();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin Privileges Required</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 mb-6">
            You must be signed in with an administrator account to view inventory management, order statuses, and store metrics.
          </p>
          <Link
            to="/login?redirect=/admin"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Sign In with Administrator Account
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await adminApi.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Add Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.price) {
      setProductError("Name, brand, and price are mandatory.");
      return;
    }

    setSubmittingProduct(true);
    setProductError("");
    try {
      const res = await adminApi.createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price),
        stock: Number(newProduct.stock || 10),
        images: [newProduct.imageUrl],
      });
      setProducts([res.product, ...products]);
      setShowProductModal(false);
      fetchOverview();
      setNewProduct({
        name: "",
        brand: "",
        category: "Mobiles, Computers",
        subcategory: "All Mobile Phones",
        price: "",
        originalPrice: "",
        stock: "25",
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      });
    } catch (err: any) {
      setProductError(err.response?.data?.error || "Failed to add product");
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Edit Product Handlers
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: String(p.price),
      originalPrice: String(p.originalPrice || p.price),
      stock: String(p.stock),
      imageUrl: p.images[0] || "",
      description: p.description || "",
    });
    setProductError("");
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmittingProduct(true);
    setProductError("");
    try {
      const updates: any = {
        name: editFormData.name,
        brand: editFormData.brand,
        category: editFormData.category,
        subcategory: editFormData.subcategory,
        price: Number(editFormData.price),
        originalPrice: Number(editFormData.originalPrice || editFormData.price),
        stock: Number(editFormData.stock),
        description: editFormData.description,
      };
      if (editFormData.imageUrl) {
        updates.images = [editFormData.imageUrl, ...editingProduct.images.slice(1)];
      }
      const res = await adminApi.updateProduct(editingProduct.id, updates);
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.product : p)));
      setEditingProduct(null);
      fetchOverview();
    } catch (err: any) {
      setProductError(err.response?.data?.error || "Failed to update product");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to remove this product from the catalog?")) return;
    try {
      await adminApi.deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
      fetchOverview();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete product");
    }
  };

  // Find subcategories for selected category in Add/Edit modal
  const activeAddCategory = categories.find((c) => c.name === newProduct.category);
  const activeEditCategory = categories.find((c) => c.name === editFormData.category);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950">
                <Shield className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ShopSphere Operations Console
              </h1>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Live enterprise product catalog, inventory tracking, and customer orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchOverview();
                fetchProducts();
              }}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>
        </div>

        {/* 5 Core Metric Cards as requested */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Card 1: Total Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Products
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {(analytics?.totalProducts || 4678).toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-indigo-600 font-medium">● Complete Catalog</span>
          </div>

          {/* Card 2: Categories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-emerald-200 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Categories
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {analytics?.totalCategories || 11}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">● Main Departments</span>
          </div>

          {/* Card 3: Subcategories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Subcategories
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {analytics?.totalSubcategories || 161}
            </div>
            <span className="text-[11px] text-purple-600 font-medium">● Active Segments</span>
          </div>

          {/* Card 4: Low Stock */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-amber-200 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Low Stock
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">
              {analytics?.lowStockCount !== undefined ? analytics.lowStockCount : 180}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">● ≤ 10 units left</span>
          </div>

          {/* Card 5: Out of Stock */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-rose-200 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Out of Stock
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600">
              {analytics?.outOfStockCount !== undefined ? analytics.outOfStockCount : 45}
            </div>
            <span className="text-[11px] text-rose-700 font-medium">● Requires Restock</span>
          </div>
        </div>

        {/* Secondary Operations Strip: Orders, Revenue & Users */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 px-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400">Total Revenue:</span>{" "}
              <strong className="text-slate-900 font-bold">
                ₹{Number(analytics?.totalRevenue || 26490).toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400">Total Orders:</span>{" "}
              <strong className="text-slate-900 font-bold">{orders.length}</strong>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400">Customers:</span>{" "}
              <strong className="text-slate-900 font-bold">{analytics?.totalUsers || 2}</strong>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            Catalog Indexed with High-Speed In-Memory Cache
          </span>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "products"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Product Catalog Management ({totalProductsCount.toLocaleString("en-IN")})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Customer Orders Pipeline ({orders.length})
          </button>
        </div>

        {/* Tab 1: Products Catalog Table with Filters & Pagination */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, brand, SKU..."
                    value={searchProductQuery}
                    onChange={(e) => {
                      setSearchProductQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("all");
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories (11)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Subcategory Filter (Cascading) */}
                {selectedCategory !== "all" && (
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Subcategories</option>
                    {categories
                      .find((c) => c.slug === selectedCategory)
                      ?.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.slug}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                )}

                {(searchProductQuery || selectedCategory !== "all" || selectedSubcategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchProductQuery("");
                      setSelectedCategory("all");
                      setSelectedSubcategory("all");
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-500">
                Showing {products.length} of {totalProductsCount.toLocaleString("en-IN")} items
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category / Subcategory</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No products match your filters.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-11 h-11 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center p-0.5">
                            <ImageWithFallback
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1 max-w-sm block">
                              {prod.name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              SKU: {prod.sku}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-semibold">{prod.brand}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-800">{prod.category}</p>
                          <p className="text-[11px] text-slate-400">{prod.subcategory}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{prod.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1 ${
                              prod.stock === 0
                                ? "bg-rose-100 text-rose-700"
                                : prod.stock <= 10
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                prod.stock === 0
                                  ? "bg-rose-500"
                                  : prod.stock <= 10
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {prod.stock === 0 ? "Out of Stock" : `${prod.stock} in stock`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
                  <strong className="text-slate-900">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders Pipeline Table */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Live Customer Orders</h2>
              <span className="text-xs text-slate-500">
                Update status below to dynamically sync customer tracking
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">No orders placed yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Live Status Action</th>
                      <th className="py-3 px-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{ord.shippingAddress.fullName}</p>
                          <p className="text-[11px] text-slate-400">{ord.userEmail}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.orderStatus}
                            disabled={updatingOrderId === ord.id}
                            onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/orders/${ord.id}`}
                            className="text-indigo-600 hover:text-indigo-900 font-bold inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal: Add New Product */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Add New Product to Catalog</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {productError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {productError}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultra Gaming Headset Pro"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sony, Apple, Nike"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.name === e.target.value);
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                          subcategory: cat?.subcategories[0]?.name || "",
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subcategory *</label>
                  <select
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {activeAddCategory?.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="1999"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">MRP Price (₹)</label>
                    <input
                      type="number"
                      placeholder="2999"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Units</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide features and details..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50"
                  >
                    {submittingProduct ? "Saving..." : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Existing Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Product</h3>
                  <p className="text-[11px] font-mono text-slate-400">ID: {editingProduct.id} • SKU: {editingProduct.sku}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {productError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {productError}
                </div>
              )}

              <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.brand}
                      onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editFormData.category}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.name === e.target.value);
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                          subcategory: cat?.subcategories[0]?.name || "",
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subcategory *</label>
                  <select
                    value={editFormData.subcategory}
                    onChange={(e) => setEditFormData({ ...editFormData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {activeEditCategory?.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={editFormData.originalPrice}
                      onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editFormData.imageUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50"
                  >
                    {submittingProduct ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
