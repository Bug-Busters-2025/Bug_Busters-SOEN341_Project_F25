const express = require("express");
const authRouter = express.Router();
const { requireAuth, getAuth } = require("@clerk/express");
const db = require("../db.js");

authRouter.post("/sync", requireAuth(), (req, res) => {
   const { userId } = getAuth(req);
   const { email, name, role = "student" } = req.body;

   if (!email || !name) {
      return res.status(400).json({ message: "Missing name or email" });
   }

   const checkSQL =
      "SELECT id, clerk_id FROM users WHERE email = ? OR clerk_id = ?";
   db.query(checkSQL, [email, userId], (err, rows) => {
      if (err) {
         console.error("❌ Database error:", err);
         return res.status(500).send("Database error");
      }

      if (rows.length === 0) {
         const insertSQL = `
        INSERT INTO users (clerk_id, name, email, role)
        VALUES (?, ?, ?, ?)
      `;
         db.query(insertSQL, [userId, name, email, role], (err2) => {
            if (err2) {
               console.error("❌ Insert failed:", err2);
               return res.status(500).send("Database error");
            }
            return res
               .status(201)
               .json({ message: `✅ User created as ${role}`, userId });
         });
      } else {
         const updateSQL = `
        UPDATE users
        SET name = ?, clerk_id = ?
        WHERE email = ?
      `;
         db.query(updateSQL, [name, userId, email], (err2) => {
            if (err2) {
               console.error("❌ Update failed:", err2);
               return res.status(500).send("Database error");
            }
            return res
               .status(200)
               .json({ message: `♻️ User updated as ${role}`, userId });
         });
      }
   });
});
authRouter.get("/role/:email", (req, res) => {
   const { email } = req.params;
   if (!email) return res.status(400).send("Email is required");

   const sql = "SELECT role FROM users WHERE email = ?";
   db.query(sql, [email], (err, rows) => {
      if (err) return res.status(500).send("Database error");
      if (rows.length === 0) return res.status(404).send("User not found");
      res.json({ role: rows[0].role });
   });
});

authRouter.get("/me", requireAuth(), (req, res) => {
   const { userId } = getAuth(req);
   console.log("🔍 Fetching MySQL ID for Clerk user:", userId);

   const sql = "SELECT id, name, email, role FROM users WHERE clerk_id = ?";
   db.query(sql, [userId], (err, rows) => {
      if (err) {
         console.error("❌ Database error:", err);
         return res.status(500).json({ message: "Database error", error: err });
      }

      if (rows.length === 0) {
         console.warn("⚠️ No user found for Clerk ID:", userId);
         return res.status(404).json({ message: "No user found" });
      }

      res.status(200).json(rows[0]);
   });
});

module.exports = authRouter;
