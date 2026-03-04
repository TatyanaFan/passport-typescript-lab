import type { NextFunction, Request, Response } from "express";

type PassportRequest = Request & { isAuthenticated(): boolean };

/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (
  req: PassportRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (
  req: PassportRequest,
  res: Response,
  next: NextFunction
) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}