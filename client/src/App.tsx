import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Header } from "./components/layout/Header";
import { MegaMenu } from "./components/layout/MegaMenu";
import { MobileDrawer } from "./components/layout/MobileDrawer";
import { Footer } from "./components/layout/Footer";
import { BottomNav } from "./components/layout/BottomNav";
import { LocationModal } from "./components/common/LocationModal";
import { Category } from "./types";
import { productApi } from "./services/api";

// Pages
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { DealsPage } from "./pages/DealsPage";
import { CartPage } from "./pages/CartPage";
import { WishlistPage } from "./pages/WishlistPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Scroll to top component on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const { user, isLoading, checkAuth } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productApi.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Initial authentication loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 animate-pulse mb-3">
          S
        </div>
        <p className="text-xs font-semibold text-slate-400">Loading ShopSphere...</p>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Navigation & Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          onToggleMegaMenu={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
          isMegaMenuOpen={isMegaMenuOpen}
          categories={categories}
        />

        {/* Desktop Mega Menu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          categories={categories}
        />

        {/* Mobile Navigation Drawer */}
        <MobileDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          categories={categories}
        />

        {/* Pincode / Delivery Location Modal */}
        <LocationModal />

        {/* Main Content Viewport */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage categories={categories} />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/category/:categorySlug" element={<CatalogPage categories={categories} />} />
            <Route path="/category/:categorySlug/:subcategorySlug" element={<CatalogPage categories={categories} />} />
            <Route path="/search" element={<CatalogPage categories={categories} />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav onOpenCategories={() => setIsMobileDrawerOpen(true)} />
      </div>
    </Router>
  );
};

export default App;
