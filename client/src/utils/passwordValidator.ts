export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export interface PasswordRequirements {
  minLength: boolean;     // At least 8 characters
  hasUppercase: boolean;  // At least 1 uppercase letter (A-Z)
  hasLowercase: boolean;  // At least 1 lowercase letter (a-z)
  hasNumber: boolean;     // At least 1 number (0-9)
  hasSpecial: boolean;    // At least 1 special character (!@#$%^&*()_+-= etc.)
}

export type PasswordStrengthLevel = "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number;       // 0 to 4
  barCount: number;    // 1 to 5 (or 0 if empty)
  percent: number;     // 0 to 100
  color: string;       // Tailwind background color
  textColor: string;   // Tailwind text color
  description: string;
}

/**
 * Checks individual requirements for a password live.
 */
export function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: SPECIAL_CHAR_REGEX.test(password),
  };
}

/**
 * Returns true only if all 5 requirements are satisfied.
 */
export function isPasswordValid(password: string): boolean {
  const req = checkPasswordRequirements(password);
  return req.minLength && req.hasUppercase && req.hasLowercase && req.hasNumber && req.hasSpecial;
}

/**
 * Calculates dynamic password strength across 5 levels:
 * Weak, Fair, Good, Strong, Very Strong.
 * Evaluates length, character classes, entropy/uniqueness, and patterns.
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length === 0) {
    return {
      level: "Weak",
      score: 0,
      barCount: 0,
      percent: 0,
      color: "bg-slate-200",
      textColor: "text-slate-400",
      description: "Enter a password",
    };
  }

  const length = password.length;
  const req = checkPasswordRequirements(password);
  const uniqueChars = new Set(password).size;

  if (length < 6) {
    return {
      level: "Weak",
      score: 0,
      barCount: 1,
      percent: 20,
      color: "bg-rose-500",
      textColor: "text-rose-600",
      description: "Too short",
    };
  }

  let points = 0;

  // Length scoring
  if (length >= 8) points += 1;
  if (length >= 12) points += 2;
  if (length >= 16) points += 2;
  if (length >= 24) points += 1;

  // Character class variety (1 to 4)
  let classCount = 0;
  if (req.hasUppercase) classCount++;
  if (req.hasLowercase) classCount++;
  if (req.hasNumber) classCount++;
  if (req.hasSpecial) classCount++;
  points += classCount;

  // Unique character diversity
  if (uniqueChars >= 8) points += 1;
  if (uniqueChars >= 12) points += 1;
  if (uniqueChars >= 16) points += 1;

  // Penalties for predictable patterns
  const lower = password.toLowerCase();
  if (lower.includes("password") || lower.includes("1234") || lower.includes("qwerty")) {
    points -= 2;
  }
  if (/(.)\1{2,}/.test(password)) {
    points -= 1;
  }

  // Map to 5-level scale:
  if (length < 8 || classCount <= 1 || points <= 3) {
    return {
      level: "Weak",
      score: 0,
      barCount: 1,
      percent: 20,
      color: "bg-rose-500",
      textColor: "text-rose-600",
      description: "Weak password",
    };
  }

  if (points <= 5) {
    return {
      level: "Fair",
      score: 1,
      barCount: 2,
      percent: 40,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      description: "Fair password",
    };
  }

  if (points <= 7) {
    return {
      level: "Good",
      score: 2,
      barCount: 3,
      percent: 60,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      description: "Good password",
    };
  }

  if (points <= 9) {
    return {
      level: "Strong",
      score: 3,
      barCount: 4,
      percent: 80,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      description: "Strong password",
    };
  }

  return {
    level: "Very Strong",
    score: 4,
    barCount: 5,
    percent: 100,
    color: "bg-indigo-600",
    textColor: "text-indigo-600",
    description: "Very strong password",
  };
}
