import "dotenv/config";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";

import passportMiddleware from "./middleware/passportMiddleware";
import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";
import adminRoute from "./routes/adminRoute";

const port = process.env.PORT || 8000;
const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1) session 
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// 2) passport
passportMiddleware(app);

// 3) routes
app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/auth", adminRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
  console.log("server started");
});