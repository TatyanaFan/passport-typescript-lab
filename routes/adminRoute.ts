import { Router } from "express";
import { ensureAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.get("/admin", ensureAdmin, (req, res) => {
  const store = req.sessionStore as any;

  if (typeof store.all !== "function") {
    return res.status(500).send("Session store does not support .all()");
  }

  store.all((err: any, sessions: any) => {
    if (err) return res.status(500).send("Error loading sessions");
    res.render("admin", { sessions });
  });
});

router.post("/admin/revoke/:sessionId", ensureAdmin, (req, res) => {
  const { sessionId } = req.params;
  const store = req.sessionStore as any;

  if (typeof store.destroy !== "function") {
    return res.status(500).send("Session store does not support .destroy()");
  }

  store.destroy(sessionId, (err: any) => {
    if (err) return res.status(500).send("Error revoking session");
    res.redirect("/auth/admin"); 
  });
});

export default router;