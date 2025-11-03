const express = require("express");
const db = require("../db.js");
const { requireAuth, getAuth } = require("@clerk/express");

const usersRouter = express.Router();

function assertAdmin(req, res, next) {
   const { userId } = getAuth(req);
   if (!userId) return res.status(401).json({ message: "Unauthorized" });

   db.query(
      "SELECT role FROM users WHERE clerk_id = ?",
      [userId],
      (err, rows) => {
         if (err) return res.status(500).json({ message: "Database error" });
         if (rows.length === 0)
            return res.status(404).json({ message: "User not found" });
         if (rows[0].role !== "admin")
            return res.status(403).json({ message: "Forbidden" });
         next();
      }
   );
}

usersRouter.get("", requireAuth(), assertAdmin, (req, res) => {
   db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id ASC",
      (err, results) => {
         if (err) return res.status(500).send("Database error");
         res.json(results);
      }
   );
});

usersRouter.put("/:userId/role", requireAuth(), assertAdmin, (req, res) => {
   const targetUserId = Number(req.params.userId);
   const { role } = req.body || {};

   if (!Number.isFinite(targetUserId)) {
      return res.status(400).json({ message: "Invalid userId" });
   }
   const allowedRoles = ["student", "organizer"];
   if (!allowedRoles.includes(role)) {
      return res
         .status(400)
         .json({ message: "Invalid role. Use student or organizer" });
   }

   db.query(
      "SELECT role FROM users WHERE id = ?",
      [targetUserId],
      (err, rows) => {
         if (err) return res.status(500).json({ message: "Database error" });
         if (rows.length === 0)
            return res.status(404).json({ message: "User not found" });
         if (rows[0].role === "admin") {
            return res
               .status(403)
               .json({ message: "Cannot change admin role" });
         }

         db.query(
            "UPDATE users SET role = ? WHERE id = ?",
            [role, targetUserId],
            (err2, result) => {
               if (err2)
                  return res.status(500).json({ message: "Database error" });
               return res.status(200).json({ ok: true });
            }
         );
      }
   );
});

usersRouter.delete("/:userId", requireAuth(), assertAdmin, (req, res) => {
   const targetUserId = Number(req.params.userId);
   if (!Number.isFinite(targetUserId)) {
      return res.status(400).json({ message: "Invalid userId" });
   }

   db.query(
      "SELECT role FROM users WHERE id = ?",
      [targetUserId],
      (err, rows) => {
         if (err) return res.status(500).json({ message: "Database error" });
         if (rows.length === 0)
            return res.status(404).json({ message: "User not found" });
         if (rows[0].role === "admin") {
            return res
               .status(403)
               .json({ message: "Cannot delete admin user" });
         }

         db.query(
            "DELETE FROM users WHERE id = ?",
            [targetUserId],
            (err2, result) => {
               if (err2)
                  return res.status(500).json({ message: "Database error" });
               return res.status(200).json({ ok: true });
            }
         );
      }
   );
});
usersRouter.get("/tickets/:userId", async (req, res) => {
   const userId = Number(req.params.userId);
   if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
   }

   const sql = `
    SELECT
      t.id AS ticket_id,
      t.status,
      t.checked_in,
      t.qr_code,
      t.created_at AS ticket_created_at,
      e.id AS event_id,
      e.title AS event_title,
      e.description AS event_description,
      e.category AS event_category,
      e.imageUrl AS event_imageUrl,
      e.event_date,
      e.location,
      e.ticket_capacity,
      e.remaining_tickets,
      e.ticket_type,
      u.id AS organizer_id,
      u.name AS organizer_name,
      u.email AS organizer_email
    FROM tickets t
    JOIN events e ON t.event_id = e.id
    JOIN users u ON e.organizer_id = u.id
    WHERE t.user_id = ?
    ORDER BY e.event_date ASC, t.id ASC
  `;

   db.query(sql, [userId], (err, rows) => {
      if (err) {
         return res
            .status(500)
            .json({ error: "Database error", details: err.message });
      }
      console.log("🎯 DB result rows:", rows);
      res.json(rows);
   });
});

usersRouter.get("/tickets/:ticketId/qr", (req, res) => {
   const ticketId = req.params.ticketId;

   db.query(
      "SELECT qr_code FROM tickets WHERE id = ?",
      [ticketId],
      (err, result) => {
         if (err) {
            console.error("DB error fetching QR:", err);
            return res.status(500).json({ message: "Database error" });
         }

         if (result.length === 0 || !result[0].qr_code) {
            return res.status(404).json({ message: "QR code not found" });
         }

         const qrDataUrl = result[0].qr_code;

         const base64Data = qrDataUrl.split(",")[1];
         const imgBuffer = Buffer.from(base64Data, "base64");

         res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": imgBuffer.length,
         });
         res.end(imgBuffer);
      }
   );
});

module.exports = usersRouter;
