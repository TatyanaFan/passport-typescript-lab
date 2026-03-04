import type { Request, Response, NextFunction } from "express";
import type { User } from "../models/userModel";

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  const user = req.user as User;
  if (user?.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  next();
}