import React from "react";
import { calculatePasswordStrength, PasswordStrengthLevel } from "../../utils/passwordValidator";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const LEVEL_COLORS: Record<PasswordStrengthLevel, { bar: string; text: string; bg: string }> = {
  Weak: { bar: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  Fair: { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  Good: { bar: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  Strong: { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  "Very Strong": { bar: "bg-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password, className = "" }) => {
  if (!password) {
    return null;
  }

  const strength = calculatePasswordStrength(password);
  const colors = LEVEL_COLORS[strength.level];

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1.5">
          {strength.score >= 3 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          )}
          <span>Password Strength:</span>
        </span>
        <span
          className={`font-bold tracking-tight px-2 py-0.5 rounded-md border text-[11px] ${colors.text} ${colors.bg}`}
        >
          {strength.level}
        </span>
      </div>

      {/* Accessible 5-bar progress visual */}
      <div
        role="progressbar"
        aria-valuenow={strength.score + 1}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuetext={`Password strength: ${strength.level}`}
        className="grid grid-cols-5 gap-1.5 h-2 w-full"
      >
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= strength.barCount;
          return (
            <div
              key={index}
              className={`h-full rounded-full transition-all duration-300 ${
                isFilled ? colors.bar : "bg-slate-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
