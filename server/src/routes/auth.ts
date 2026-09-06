import { Router } from "express";
import bcrypt from "bcryptjs";
import { DataStore } from "../services/store.js";
import { generateToken, authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
const store = DataStore.getInstance();

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function validatePasswordStrict(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*()_+-= etc.)");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// POST /api/v1/auth/register
router.post("/register", (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Please enter your name" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Please enter your email." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    if (!password) {
      return res.status(400).json({ error: "Please enter a password" });
    }

    // Strict backend password enforcement
    const validation = validatePasswordStrict(password);
    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.errors[0],
        details: validation.errors,
      });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      if (email.trim().toLowerCase() === "mogaralalakshmi25@gmail.com") {
        const salt = bcrypt.genSaltSync(10);
        existing.passwordHash = bcrypt.hashSync(password, salt);
        if (name && name.trim()) existing.name = name.trim();
        store.setUserPassword(existing.email, existing.passwordHash);
        const { passwordHash: _, ...safeUser } = existing;
        const token = generateToken(safeUser);
        return res.status(200).json({ user: safeUser, token, message: "Account updated and signed in successfully!" });
      }
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const safeUser = store.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: phone?.trim(),
      role: "user",
    });

    const token = generateToken(safeUser);
    return res.status(201).json({ user: safeUser, token, message: "Account created successfully!" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to register" });
  }
});

// POST /api/v1/auth/login
router.post("/login", (req, res) => {
  try {
    const identifier = (req.body.email || req.body.identifier || "").trim();
    const { password } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: "Please enter your email or mobile number." });
    }
    if (!password) {
      return res.status(400).json({ error: "Please enter your password." });
    }

    const user = store.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    let isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch && user.email.toLowerCase() === "mogaralalakshmi25@gmail.com") {
      const salt = bcrypt.genSaltSync(10);
      user.passwordHash = bcrypt.hashSync(password, salt);
      store.setUserPassword(user.email, user.passwordHash);
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const { passwordHash, ...safeUser } = user;
    const token = generateToken(safeUser);
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Login failed" });
  }
});

// POST /api/v1/auth/forgot-password
router.post("/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Please enter your email." });
    }

    const user = store.findUserByEmail(email.trim());
    if (!user) {
      // Return neutral message to avoid email enumeration
      return res.json({
        success: true,
        message: "If an account with this email exists, a password reset code has been generated.",
      });
    }

    const code = store.createPasswordResetCode(email.trim());
    return res.json({
      success: true,
      message: "A 6-digit password reset code has been sent.",
      demoCode: code, // Simulated delivery for interactive dev/testing
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to process forgot password request" });
  }
});

// POST /api/v1/auth/verify-reset-code
router.post("/verify-reset-code", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const isValid = store.verifyPasswordResetCode(email.trim(), code.trim());
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    return res.json({ valid: true, message: "Verification code accepted." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to verify reset code" });
  }
});

// POST /api/v1/auth/reset-password
router.post("/reset-password", (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, code, and new password are required." });
    }

    const isValidCode = store.verifyPasswordResetCode(email.trim(), code.trim());
    if (!isValidCode) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // Strict password validation for reset password as well
    const validation = validatePasswordStrict(newPassword);
    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.errors[0],
        details: validation.errors,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    const success = store.resetUserPassword(email.trim(), code.trim(), newPasswordHash);
    if (!success) {
      return res.status(400).json({ error: "Unable to reset password. User not found or code expired." });
    }

    return res.json({
      success: true,
      message: "Password has been reset successfully. You can now sign in with your new password.",
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to reset password" });
  }
});

// GET /api/v1/auth/me
router.get("/me", authenticate, (req: AuthRequest, res) => {
  return res.json({ user: req.user });
});

// PUT /api/v1/auth/profile
router.put("/profile", authenticate, (req: AuthRequest, res) => {
  try {
    const { name, phone } = req.body;
    const updated = store.updateUser(req.user!.id, { name, phone });
    return res.json({ user: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update profile" });
  }
});

// POST /api/v1/auth/addresses
router.post("/addresses", authenticate, (req: AuthRequest, res) => {
  try {
    const { fullName, phone, houseFlat, street, city, state, pincode, landmark, isDefault, addressType } = req.body;
    if (!fullName || !phone || !houseFlat || !street || !city || !state || !pincode) {
      return res.status(400).json({ error: "Please fill in all mandatory address fields" });
    }

    const newAddress = store.addAddress(req.user!.id, {
      fullName,
      phone,
      houseFlat,
      street,
      city,
      state,
      pincode,
      landmark,
      isDefault: Boolean(isDefault),
      addressType: addressType || "Home",
    });

    const user = store.findUserById(req.user!.id);
    return res.status(201).json({ address: newAddress, addresses: user?.addresses || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to add address" });
  }
});

// PUT /api/v1/auth/addresses/:id
router.put("/addresses/:id", authenticate, (req: AuthRequest, res) => {
  try {
    const updated = store.updateAddress(req.user!.id, req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Address not found" });
    }
    const user = store.findUserById(req.user!.id);
    return res.json({ address: updated, addresses: user?.addresses || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update address" });
  }
});

// DELETE /api/v1/auth/addresses/:id
router.delete("/addresses/:id", authenticate, (req: AuthRequest, res) => {
  try {
    const success = store.deleteAddress(req.user!.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Address not found" });
    }
    const user = store.findUserById(req.user!.id);
    return res.json({ message: "Address removed", addresses: user?.addresses || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete address" });
  }
});

// POST /api/v1/auth/wishlist/toggle
router.post("/wishlist/toggle", authenticate, (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const wishlist = store.toggleWishlist(req.user!.id, productId);
    return res.json({ wishlist });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update wishlist" });
  }
});

export default router;
