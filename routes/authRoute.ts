import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import { ensureAdmin } from "../middleware/adminMiddleware";
import type session from "express-session";
import type { Store } from "express-session";

const router = express.Router();

type StoreWithAllDestroy = Store & {
  all?: (cb: (err: any, sessions: any) => void) => void;
  destroy?: (sid: string, cb: (err?: any) => void) => void;
};

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login",
    failureMessage: true,
    successRedirect: "/dashboard",
  })
);

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = (req.session as unknown as { messages?: string[] }).messages;
  const error = messages && messages.length > 0 ? messages[messages.length - 1] : undefined;
  if (messages) {
    (req.session as unknown as { messages?: string[] }).messages = [];
  }
  res.render("login", { error });
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

router.get("/admin", ensureAdmin, (req, res) => {
  const store = req.sessionStore as session.Store | undefined;

  const allFn = store && (store as any).all;
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

  const store = req.sessionStore as session.Store | undefined;
  const destroyFn = store && (store as any).destroy;

  if (typeof destroyFn !== "function") {
    return res.status(500).send("Session store does not support .destroy()");
  }

  destroyFn.call(store, sessionId, (err: any) => {
    if (err) return res.status(500).send("Error revoking session");
    res.redirect("/admin");
  });
});

router.get("/admin", ensureAdmin, (req, res) => {
  const store = req.sessionStore as StoreWithAllDestroy;

  if (typeof store.all !== "function") {
    return res.status(500).send("Session store does not support .all()");
  }

  store.all((err, sessions) => {
    if (err) return res.status(500).send("Error loading sessions");
    res.render("admin", { sessions });
  });
});

router.post("/admin/revoke/:sessionId", ensureAdmin, (req, res) => {
  const { sessionId } = req.params;
  const store = req.sessionStore as StoreWithAllDestroy;

  if (typeof store.destroy !== "function") {
    return res.status(500).send("Session store does not support .destroy()");
  }

  store.destroy(sessionId, (err) => {
    if (err) return res.status(500).send("Error revoking session");
    res.redirect("/auth/admin");
  });
});

export default router;

