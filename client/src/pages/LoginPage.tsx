import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { PasswordInput } from "../components/auth/PasswordInput";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { user, login } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      try {
        const pending = sessionStorage.getItem("shopsphere_pending_cart_item");
        if (pending) {
          const item = JSON.parse(pending);
          sessionStorage.removeItem("shopsphere_pending_cart_item");
          if (item && item.product) {
            useCartStore
              .getState()
              .addItem(
                item.product,
                item.quantity || 1,
                item.selectedColor,
                item.selectedSize
              );
          }
        }
      } catch (err) {}
      navigate(redirect, { replace: true });
    }
  }, [user, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const identEl = form.querySelector<HTMLInputElement>('input[name="identifier"], #identifier');
    const passEl = form.querySelector<HTMLInputElement>('input[name="password"], #password');

    const finalIdentifier = (identifier || identEl?.value || "").trim();
    const finalPassword = password || passEl?.value || "";

    const errors: { identifier?: string; password?: string } = {};
    if (!finalIdentifier) {
      errors.identifier = "Please enter your email.";
    }
    if (!finalPassword) {
      errors.password = "Please enter your password.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await login(finalIdentifier, finalPassword, rememberMe);
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-10 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-3.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl p-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Shop<span className="text-indigo-600">Sphere</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to ShopSphere
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Sign in to your account
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {searchParams.get("reason") === "cart" && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-800 font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>Please sign in to add products to your shopping cart.</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="on">
            {/* Email / Mobile Number */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer"
              >
                Email / Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username email"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) {
                      setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    fieldErrors.identifier
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {fieldErrors.identifier && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {fieldErrors.identifier}
                </p>
              )}
            </div>

            {/* Password with Eye toggle */}
            <div>
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                placeholder=""
                required
                autoComplete="current-password"
                value={password}
                error={fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
              />
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 cursor-pointer transition-colors"
                />
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 py-0.5"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>




          {/* Create Account Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${redirect}`}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 py-0.5"
            >
              Create your ShopSphere account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
