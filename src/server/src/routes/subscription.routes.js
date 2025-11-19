const { Router } = require("express");
const { pool } = require("../db");
const { requireAuth, getAuth } = require("@clerk/express");

const subscriptionsRouter = Router();

async function getMysqlUserId(req) {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) { 
        const err = new Error("Unauthorized"); err.status = 401; throw err; 
    }

    const [rows] = await pool.execute("SELECT id FROM users WHERE clerk_id = ? LIMIT 1", [clerkId]);
    if (rows.length === 0) { 
        const err = new Error("User not found for this Clerk account"); 
        err.status = 404; throw err; 
    }

    return rows[0].id;
}

const toInt = (v) => (Number.isInteger(Number(v)) ? Number(v) : null);

/**
 * GET /organizers/:organizer_id/followers
 * list followers (users) for an organizer
 */
subscriptionsRouter.get("/organizers/:organizer_id/followers", requireAuth(), async (req, res) => {
    const organizerId = toInt(req.params.organizer_id);
    if (!organizerId) return res.status(400).json({ error: "Invalid organizer_id" });

    try {
        const [rows] = await pool.execute(
            `SELECT
                u.id          AS user_id,
                u.name,
                u.email,
            os.created_at AS followed_at
            FROM organizer_subscriptions AS os
            JOIN users AS u ON u.id = os.user_id
            WHERE os.organizer_id = ?
            ORDER BY u.name ASC`,
            [organizerId]
        );

        res.json({ count: rows.length, followers: rows });
    } catch (err) {
        console.error("GET /organizers/:organizer_id/followers error:", err?.message);
        res.status(500).json({ error: "Failed to get list of followers" });
    }
});

/**
 * DELETE /organizers/:organizer_id/subscribers/:user_id
 * remove a specific subscriber from an organizer
 */
subscriptionsRouter.delete("/organizers/:organizer_id/subscribers/:user_id", requireAuth(), async (req, res) => {
    try {
        const currentUserId = await getMysqlUserId(req);
        const organizerId = toInt(req.params.organizer_id);
        const subscriberId = toInt(req.params.user_id);

        if (!organizerId || !subscriberId) {
            return res.status(400).json({ error: "Invalid organizer_id or user_id" });
        }
        if (currentUserId !== organizerId) {
            return res.status(403).json({ error: "Only this organizer can remove subscribers" });
        }

        const [result] = await pool.execute(
            `DELETE FROM organizer_subscriptions
            WHERE organizer_id = ? AND user_id = ?`,
            [organizerId, subscriberId]
        );

        if (result.affectedRows > 0) {
            return res.status(204).send();
        }
        return res.status(404).json({ error: "Subscription not found" });
    } catch (err) {
        console.error("DELETE /organizers/:organizer_id/subscribers/:user_id error:", err);
        return res.status(500).json({ error: "Failed to remove subscriber" });
    }
});

/**
 * DELETE /organizers/:organizer_id/follow
 * current user unfollows organizer
 */
subscriptionsRouter.delete("/organizers/:organizer_id/follow", requireAuth(), async (req, res) => {
    const userId = await getMysqlUserId(req);
    const organizerId = toInt(req.params.organizer_id);
    if (!organizerId) return res.status(400).json({ error: "Invalid organizer_id" });

    try {
        const [result] = await pool.execute(
            `DELETE FROM organizer_subscriptions
             WHERE user_id = ? AND organizer_id = ?`,
            [userId, organizerId]
        );

        const removed = result.affectedRows > 0;
        return res.status(200).json({ removed });
    } catch (err) {
        console.error("DELETE /organizers/:organizer_id/follow error:", err?.message);
        res.status(500).json({ error: "Failed to unfollow organizer" });
    }
});

/**
 * GET /me/following
 * list organizers I follow
 */
subscriptionsRouter.get("/me/following", requireAuth(), async (req, res) => {
    const userId = await getMysqlUserId(req);
    try {
        const [rows] = await pool.execute(
            `SELECT u.id            AS organizer_id,
                    u.name          AS organizer_name,
                    u.email
            FROM organizer_subscriptions AS os
            JOIN users AS u
            ON u.id = os.organizer_id
            AND u.role = 'organizer'
            WHERE os.user_id = ?
            ORDER BY u.name ASC`,
            [userId]
        );
        res.json({ count: rows.length, organizers: rows });
    } catch (err) {
        console.error("GET /me/following error:", err?.message);
        res.status(500).json({ error: "Failed to load list of organizers I follow" });
    }
});

/**
 * GET /me/feed
 * events from organizers I follow
 * Query: ?limit=50&offset=0
 */
subscriptionsRouter.get("/me/feed", requireAuth(), async (req, res) => {
    const userId = await getMysqlUserId(req);
  
    const rawLimit = toInt(req.query.limit);
    const rawOffset = toInt(req.query.offset);
  
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 50;
    const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;
  
    try {
        const [events] = await pool.execute(
            `SELECT e.*
            FROM events AS e
            JOIN organizer_subscriptions AS os ON os.organizer_id = e.organizer_id
            WHERE os.user_id = ?
            ORDER BY e.event_date DESC
            LIMIT ${limit} OFFSET ${offset}`,
            [userId]
        );
    
        return res.json({ count: events.length, limit, offset, events });
    } catch (err) {
        console.error("GET /me/feed error:", err?.message);
        res.status(500).json({ error: "Failed to load feed" });
    }
});

/**
 * POST /organizers/:organizer_id/follow
 * follow an organizer
 */
subscriptionsRouter.post("/organizers/:organizer_id/follow", requireAuth(), async (req, res) => {
    const userId = await getMysqlUserId(req);
    const organizerId = toInt(req.params.organizer_id);
    if (!organizerId) return res.status(400).json({ error: "Invalid organizer_id" });

    try {
        const [result] = await pool.execute(
            `INSERT IGNORE INTO organizer_subscriptions (user_id, organizer_id)
            VALUES (?, ?)`,
            [userId, organizerId]
        );
        const created = result.affectedRows > 0;
        return res.status(created ? 201 : 200).json({ followed: true, created });
    } catch (err) {
        console.error("POST /organizers/:organizer_id/follow error:", err?.message);
        res.status(500).json({ error: "Failed to follow organizer" });
    }
});

module.exports = subscriptionsRouter;