import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import api from "./routes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/error";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const cors = require("cors");
const { clerkMiddleware, requireAuth, getAuth } = require("@clerk/express")

const app = express();
app.use(express.json());
app.use("/api/v1", api);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

export default app;