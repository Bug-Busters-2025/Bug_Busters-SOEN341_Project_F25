import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import api from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import cors from "cors";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

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