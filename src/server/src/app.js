const express = require("express");
const dotenv = require("dotenv");
const path = require("node:path");
const api = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const { clerkMiddleware, requireAuth, getAuth } = require("@clerk/express");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
app.use(cors({ origin: ["http://localhost:5173","http://192.168.0.143:5173"], credentials: true }));
app.use(express.json());

app.use("/api/v1", api);
app.use(clerkMiddleware());

// public/protected samples
app.get("/public", (_req, res) => res.json({ ok: true }));
app.get("/protected", requireAuth(), (req, res) => {
   const { userId } = getAuth(req);
   res.json({ ok: true, userId });
});

// 404 + error handlers last
app.use(notFound);
app.use(errorHandler);



module.exports = app;
