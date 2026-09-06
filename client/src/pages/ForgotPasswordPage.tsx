import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { authApi } from "../services/api";
import { PasswordInput } from "../components/auth/PasswordInput";
import { PasswordRequirements } from "../components/auth/PasswordRequirements";
import { PasswordStrengthMeter } from "../components/auth/PasswordStrengthMeter";
import { isPasswordValid } from "../utils/passwordValidator";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step state: 1 = Email, 2 = Verify Code & New Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isCodeValid = code.trim().length === 6;
  const isPasswordCriteriaMet = isPasswordValid(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Step 1: Request Code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setInfoMessage(res.message);
      if (res.demoCode) {
        setDemoCode(res.demoCode);
      }
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (!isPasswordCriteriaMet) {
      setError("Password does not meet the security requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. Please check the code and try again.");
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
            {step === 3 ? "Password Reset Complete" : "Reset your password"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            {step === 1 && "Enter your email address to receive a secure recovery code."}
            {step === 2 && `Enter the 6-digit code sent to ${email} and choose a new password.`}
            {step === 3 && "Your account password has been successfully updated."}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Info Banner */}
          {infoMessage && step === 2 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Dev/Demo Mode Code Assistant */}
          {demoCode && step === 2 && (
            <div className="mb-5 p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-indigo-900">Demo Verification Code: </span>
                  <span className="font-mono font-bold text-indigo-700 tracking-widest">{demoCode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCode(demoCode)}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline text-xs cursor-pointer ml-2"
              >
                Autofill
              </button>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="recovery-email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer"
                >
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="recovery-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isEmailValid}
                className={`w-full py-3 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isEmailValid && !loading
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.99]"
                    : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter Code and New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
              {/* 6-Digit Code */}
              <div>
                <label
                  htmlFor="reset-code"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer"
                >
                  6-Digit Verification Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound
                    aria-hidden="true"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="reset-code"
                    name="code"
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, ""));
                      if (error) setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl text-sm font-mono tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <PasswordInput
                  id="new-password"
                  name="new-password"
                  label="New Password"
                  required
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                />

                {/* Password Strength */}
                {newPassword.length > 0 && (
                  <PasswordStrengthMeter password={newPassword} className="pt-1" />
                )}

                {/* Requirements Checklist - only shown while entering password */}
                {newPassword.length > 0 && (
                  <PasswordRequirements password={newPassword} className="mt-2 animate-fade-in" />
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <PasswordInput
                  id="confirm-new-password"
                  name="confirm-new-password"
                  label="Confirm New Password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                />

                {/* Match Indicator */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isCodeValid || !isPasswordCriteriaMet || !passwordsMatch || loading}
                className={`w-full py-3 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isCodeValid && isPasswordCriteriaMet && passwordsMatch && !loading
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.99]"
                    : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email</span>
              </button>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Password Reset Successful!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Your new password has been securely saved. You can now sign in to your ShopSphere account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Footer Back Link */}
          {step !== 3 && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 py-0.5"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
