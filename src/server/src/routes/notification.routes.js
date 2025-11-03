const { Router } = require("express");
const { requireAuth, getAuth } = require("@clerk/express");
const notificationRouter = Router();
const db = require("../db.js");

// Get notifications for the authenticated user (organizers only)
notificationRouter.get("/", requireAuth(), (req, res) => {
   const { userId } = getAuth(req);

   if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   // Get the internal user ID and role from Clerk ID
   db.query(
      "SELECT id, role FROM users WHERE clerk_id = ?",
      [userId],
      (err, userRows) => {
         if (err) {
            console.error("Database error fetching user:", err);
            return res.status(500).json({ message: "Database error" });
         }
         if (userRows.length === 0) {
            return res.status(401).json({ message: "Unauthorized" });
         }

         const internalUserId = userRows[0].id;
         const userRole = userRows[0].role;

         // Only organizers can access notifications
         if (userRole !== "organizer") {
            return res.status(403).json({ message: "Only organizers can access notifications" });
         }

         // Get notifications with event details
         const sql = `
            SELECT 
               n.id,
               n.user_id,
               n.event_id,
               n.timestamp,
               e.title AS event_title,
               e.status AS event_status
            FROM notification n
            JOIN events e ON n.event_id = e.id
            WHERE n.user_id = ?
            ORDER BY n.timestamp DESC
         `;

         db.query(sql, [internalUserId], (err, notifications) => {
            if (err) {
               console.error("Database error fetching notifications:", err);
               return res.status(500).json({ message: "Database error" });
            }
            res.status(200).json(notifications);
         });
      }
   );
});

// Mark notification as read (delete it) - organizers only
notificationRouter.delete("/:notification_id", requireAuth(), (req, res) => {
   const { userId } = getAuth(req);
   const { notification_id } = req.params;

   if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   // Get the internal user ID and role from Clerk ID
   db.query(
      "SELECT id, role FROM users WHERE clerk_id = ?",
      [userId],
      (err, userRows) => {
         if (err) {
            console.error("Database error fetching user:", err);
            return res.status(500).json({ message: "Database error" });
         }
         if (userRows.length === 0) {
            return res.status(401).json({ message: "Unauthorized" });
         }

         const internalUserId = userRows[0].id;
         const userRole = userRows[0].role;

         // Only organizers can dismiss notifications
         if (userRole !== "organizer") {
            return res.status(403).json({ message: "Only organizers can dismiss notifications" });
         }

         // Delete notification only if it belongs to the user
         const sql = `DELETE FROM notification WHERE id = ? AND user_id = ?`;
         db.query(sql, [notification_id, internalUserId], (err, results) => {
            if (err) {
               console.error("Database error deleting notification:", err);
               return res.status(500).json({ message: "Database error" });
            }
            if (results.affectedRows === 0) {
               return res.status(404).json({ message: "Notification not found" });
            }
            res.status(200).json({ message: "Notification deleted", ok: true });
         });
      }
   );
});

module.exports = notificationRouter;
