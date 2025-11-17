const express = require("express");
const authRouter = express.Router();
const { requireAuth, getAuth } = require("@clerk/express");
const db = require("../db.js");

// Comma-separated list of admin emails in server .env
// Example: ADMIN_EMAILS="kalbrammal@gmail.com, other.admin@ex.com"
const ADMIN_EMAILS = String(process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/**
 * POST /api/v1/auth/sync
 * Ensures the signed-in Clerk user exists in MySQL:
 *  - insert (clerk_id,name,email,role) if missing
 *  - update (name,clerk_id) if exists
 *  - if email is in ADMIN_EMAILS, force role='admin'
 * Request body: { name, email, role? }
 */
authRouter.post("/sync", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  let { email, name, role = "student" } = req.body || {};

  if (!email || !name) {
    return res.status(400).json({ message: "Missing name or email" });
  }

  email = String(email).toLowerCase();
  const shouldBeAdmin = ADMIN_EMAILS.includes(email);
  const finalRole = shouldBeAdmin ? "admin" : role;

  const selectSQL = "SELECT id, role FROM users WHERE email = ? OR clerk_id = ?";
  db.query(selectSQL, [email, userId], (err, rows) => {
    if (err) {
      console.error("❌ /auth/sync select error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length === 0) {
      const insertSQL = `
        INSERT INTO users (clerk_id, name, email, role)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertSQL, [userId, name, email, finalRole], (err2) => {
        if (err2) {
          console.error("❌ /auth/sync insert error:", err2);
          return res.status(500).json({ message: "Database error" });
        }
        return res
          .status(201)
          .json({ message: `✅ User created as ${finalRole}`, userId });
      });
      return;
    }

    // Exists → update name & clerk_id; also promote to admin if configured
    const updateSQL = shouldBeAdmin
      ? `UPDATE users SET name = ?, clerk_id = ?, role = 'admin' WHERE email = ?`
      : `UPDATE users SET name = ?, clerk_id = ? WHERE email = ?`;

    db.query(updateSQL, [name, userId, email], (err3) => {
      if (err3) {
        console.error("❌ /auth/sync update error:", err3);
        return res.status(500).json({ message: "Database error" });
      }
      return res
        .status(200)
        .json({ message: `♻️ User synced${shouldBeAdmin ? " (admin)" : ""}`, userId });
    });
  });
});

/**
 * GET /api/v1/auth/role/:email
 * Convenience endpoint: returns { role } by email.
 */
authRouter.get("/role/:email", (req, res) => {
  const email = String(req.params.email || "").toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query("SELECT role FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ role: rows[0].role });
  });
});

/**
 * GET /api/v1/auth/me
 * Returns the DB user (id,name,email,role) for the current Clerk user.
 */
authRouter.get("/me", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  const sql = "SELECT id, name, email, role FROM users WHERE clerk_id = ?";
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ /auth/me error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(rows[0]);
  });
});

module.exports = authRouter;
