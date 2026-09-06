import React from "react";
import { Check, Circle } from "lucide-react";
import { checkPasswordRequirements, PasswordRequirements as IRequirements } from "../../utils/passwordValidator";

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, className = "" }) => {
  const req: IRequirements = checkPasswordRequirements(password);

  const items = [
    { key: "minLength", label: "At least 8 characters", satisfied: req.minLength },
    { key: "hasUppercase", label: "One uppercase letter (A-Z)", satisfied: req.hasUppercase },
    { key: "hasLowercase", label: "One lowercase letter (a-z)", satisfied: req.hasLowercase },
    { key: "hasNumber", label: "One number (0-9)", satisfied: req.hasNumber },
    { key: "hasSpecial", label: "One special character (!@#$%^&* etc.)", satisfied: req.hasSpecial },
  ];

  return (
    <div
      className={`bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs ${className}`}
      aria-label="Password requirements"
    >
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <span>Password requirements</span>
        <span className="font-semibold text-slate-400">
          {items.filter((i) => i.satisfied).length}/5 met
        </span>
      </div>

      <ul className="space-y-1.5" aria-live="polite">
        {items.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-2 transition-colors duration-150 ${
              item.satisfied ? "text-emerald-700 font-medium" : "text-slate-500"
            }`}
          >
            {item.satisfied ? (
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center flex-shrink-0">
                <Circle className="w-2 h-2 fill-slate-400 stroke-0" aria-hidden="true" />
              </span>
            )}
            <span className="text-xs">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
