import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DataStore } from "../services/store.js";
import { SafeUser } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "shopsphere-super-secure-jwt-secret-key-2026";

export interface AuthRequest extends Request {
  user?: SafeUser;
}

export function generateToken(user: SafeUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Access token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const store = DataStore.getInstance();
    const user = store.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User no longer exists" });
    }

    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}

export function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const store = DataStore.getInstance();
    const user = store.findUserById(decoded.id);
    if (user) {
      const { passwordHash, ...safeUser } = user;
      req.user = safeUser;
    }
  } catch (err) {
    // ignore optional token error
  }
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Administrator access required" });
    }
    next();
  });
}
