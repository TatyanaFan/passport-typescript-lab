import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { ensureAdmin } from "../middleware/adminMiddleware";
import type { Store } from "express-session";

router.get("/admin", ensureAdmin, (req, res) => {
  const store = req.sessionStore as Store;

  const allFn = (store as any).all;
  if (typeof allFn !== "function") {
    return res.status(500).send("Session store does not support .all()");
  }

  allFn.call(store, (err: any, sessions: any) => {
    if (err) return res.status(500).send("Error loading sessions");
    res.render("admin", { sessions });
  });
});

router.post("/admin/revoke/:sessionId", ensureAdmin, (req, res) => {
  const { sessionId } = req.params;
  const store = req.sessionStore as Store;

  const destroyFn = (store as any).destroy;
  if (typeof destroyFn !== "function") {
    return res.status(500).send("Session store does not support .destroy()");
  }

  destroyFn.call(store, sessionId, (err: any) => {
    if (err) return res.status(500).send("Error revoking session");
    res.redirect("/admin");
  });
});

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
