import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, ArrowRight, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { PasswordInput } from "../components/auth/PasswordInput";
import { PasswordRequirements } from "../components/auth/PasswordRequirements";
import { PasswordStrengthMeter } from "../components/auth/PasswordStrengthMeter";
import { isPasswordValid } from "../utils/passwordValidator";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { user, register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordCriteriaMet = isPasswordValid(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Submit button is active ONLY when all required fields are valid
  const isFormValid =
    isNameValid &&
    isEmailValid &&
    isPasswordCriteriaMet &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!isFormValid) {
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccessMessage("Account created successfully! Welcome to ShopSphere.");
      setTimeout(() => {
        navigate(redirect);
      }, 1000);
    } catch (err: any) {
      setServerError(err.message || "Registration failed. Please try again.");
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
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Join millions of shoppers on ShopSphere
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {/* Server Error Alert */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-medium flex items-center gap-2.5 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User
                  aria-hidden="true"
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (serverError) setServerError("");
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    touched.name && !isNameValid
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {touched.name && !isNameValid && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  Please enter your name
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer"
              >
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (serverError) setServerError("");
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    touched.email && !isEmailValid
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {touched.email && !isEmailValid && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="space-y-2">
              <PasswordInput
                id="register-password"
                name="new-password"
                label="Password"
                placeholder=""
                required
                autoComplete="new-password"
                value={password}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (serverError) setServerError("");
                }}
              />

              {/* Dynamic Live Password Strength */}
              {password.length > 0 && (
                <PasswordStrengthMeter password={password} className="pt-1" />
              )}

              {/* Live Password Requirements Checklist - only shown while entering password */}
              {password.length > 0 && (
                <PasswordRequirements password={password} className="mt-2 animate-fade-in" />
              )}
            </div>

            {/* Confirm Password Field with Eye Toggle */}
            <div>
              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                label="Confirm Password"
                placeholder=""
                required
                autoComplete="new-password"
                value={confirmPassword}
                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (serverError) setServerError("");
                }}
              />

              {/* Match Feedback Indicator */}
              {confirmPassword.length > 0 && (
                <div
                  className={`mt-2 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                    passwordsMatch
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-rose-700 bg-rose-50 border-rose-200"
                  }`}
                  role="status"
                >
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>✓ Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>✕ Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Create Account Button (Active only when all required fields are valid) */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isFormValid && !loading
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.99]"
                  : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${redirect}`}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 py-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
