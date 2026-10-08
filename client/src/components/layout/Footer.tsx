import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle,
  Mail,
  Send,
} from "lucide-react";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes("@")) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-12 pb-20 lg:pb-12 mt-16">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Lightning Fast Delivery</p>
              <p className="text-[11px] text-slate-400">Free shipping on orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Genuine Products</p>
              <p className="text-[11px] text-slate-400">Direct from authorized brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">7-Day Easy Returns</p>
              <p className="text-[11px] text-slate-400">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">24x7 Customer Care</p>
              <p className="text-[11px] text-slate-400">Support via call, chat & email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: ShopSphere About */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              ShopSphere
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About ShopSphere
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers at ShopSphere
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-white transition-colors">
                  Press Releases
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-white transition-colors">
                  Eco & Sustainability
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Corporate Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Service */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link to="/shipping-rates" className="hover:text-white transition-colors">
                  Shipping Rates & Policies
                </Link>
              </li>
              <li>
                <Link to="/payments-help" className="hover:text-white transition-colors">
                  Payment Security & Methods
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Shopping */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Shopping
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/category/electronics" className="hover:text-white transition-colors">
                  Electronics & TVs
                </Link>
              </li>
              <li>
                <Link to="/category/mobiles" className="hover:text-white transition-colors">
                  Flagship Mobiles
                </Link>
              </li>
              <li>
                <Link to="/category/laptops" className="hover:text-white transition-colors">
                  Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="hover:text-white transition-colors">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link to="/category/shoes" className="hover:text-white transition-colors">
                  Shoes & Footwear
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors">
                  Daily Deals & Coupons
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Your Saved Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Legal & Safety
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition-colors">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition-colors">
                  Security Vulnerability Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Social */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Stay Connected
            </h4>
            <p className="text-slate-400 mb-3 text-xs leading-relaxed">
              Subscribe for exclusive flash deals, festival offers, and new launches.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold p-2.5 bg-emerald-950/40 border border-emerald-800 rounded-xl">
                <CheckCircle className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}

            <div className="mt-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Follow ShopSphere
              </span>
              <div className="flex gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="Instagram"
                >
                  IG
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="Facebook"
                >
                  FB
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="YouTube"
                >
                  YT
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  IN
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm">ShopSphere</span>
          <span>© {new Date().getFullYear()} ShopSphere Internet Private Limited. All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>100% Secure Simulated Gateway</span>
          <span>•</span>
          <span>PCI-DSS Compliant</span>
          <span>•</span>
          <span>ISO 27001 Certified</span>
        </div>
      </div>
    </footer>
  );
};
