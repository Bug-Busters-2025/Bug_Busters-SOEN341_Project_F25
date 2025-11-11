const { Router } = require("express");
const { pool } = require("../db");
const { requireAuth, getAuth } = require("@clerk/express");

const subscriptionsRouter = Router();
const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

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
subscriptionsRouter.get("/organizers/:organizer_id/followers", requireAuth(), ah(async (req, res) => {
    const organizerId = toInt(req.params.organizer_id);
    if (!organizerId) return res.status(400).json({ error: "Invalid organizer_id" });

    try {
        const [rows] = await pool.execute(
            `SELECT u.id, u.name, u.email
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
}));

/**
 * DELETE /organizers/:organizer_id/subscribers/:user_id
 * remove a specific subscriber from an organizer
 */
subscriptionsRouter.delete("/organizers/:organizer_id/subscribers/:user_id", requireAuth(), ah(async (req, res) => {
    const { userId: clerkId } = getAuth(req);
    const [[me]] = await pool.execute("SELECT id, role FROM users WHERE clerk_id = ? LIMIT 1", [clerkId]);
    if (!me) return res.status(404).json({ error: "User not found" });

    const organizerId = toInt(req.params.organizer_id);
    const subscriberId = toInt(req.params.user_id);
    if (!organizerId || !subscriberId) return res.status(400).json({ error: "Invalid organizer_id or user_id" });
    if (me.role !== "organizer") return res.status(403).json({ error: "Only organizers can remove subscribers" });

    try {
        const [result] = await pool.execute(
            `DELETE FROM organizer_subscriptions
            WHERE organizer_id = ? AND user_id = ?`,
            [organizerId, subscriberId]
        );

        if (result.affectedRows > 0) return res.status(204).send();
        return res.status(404).json({ error: "Subscription not found" });
    } catch (err) {
        console.error("DELETE /organizers/:organizer_id/subscribers/:user_id error:", err?.message);
        res.status(500).json({ error: "Failed to remove subscriber" });
    }
}));

/**
 * DELETE /organizers/:organizer_id/follow
 * current user unfollows organizer
 */
subscriptionsRouter.delete("/organizers/:organizer_id/follow", requireAuth(), ah(async (req, res) => {
    const userId = await getMysqlUserId(req);
    const organizerId = toInt(req.params.organizer_id);
    if (!organizerId) return res.status(400).json({ error: "Invalid organizer_id" });

    try {
        const [result] = await pool.execute(
            `DELETE FROM organizer_subscriptions
            WHERE user_id = ? AND organizer_id = ?`,
            [userId, organizerId]
        );

        if (result.affectedRows > 0) return res.status(204).send();
        return res.status(200).json({ followed: false, deleted: false });
    } catch (err) {
        console.error("DELETE /organizers/:organizer_id/follow error:", err?.message);
        res.status(500).json({ error: "Failed to unfollow organizer" });
    }
}));

/**
 * GET /me/following
 * list organizers I follow
 */
subscriptionsRouter.get("/me/following", requireAuth(), ah(async (req, res) => {
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
}));

/**
 * GET /me/feed
 * events from organizers I follow
 * Query: ?limit=50&offset=0
 */
subscriptionsRouter.get("/me/feed", requireAuth(), ah(async (req, res) => {
    const userId = await getMysqlUserId(req);
    const limit = toInt(req.query.limit) ?? 50;
    const offset = toInt(req.query.offset) ?? 0;
    try {
        const [events] = await pool.execute(
            `SELECT e.*
            FROM events AS e
            JOIN organizer_subscriptions AS os ON os.organizer_id = e.organizer_id
            WHERE os.user_id = ?
            ORDER BY e.event_date DESC
            LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );
        return res.json({ count: events.length, limit, offset, events });
    } catch (err) {
        console.error("GET /me/feed error:", err?.message);
        res.status(500).json({ error: "Failed to load feed" });
    }
}));

/**
 * POST /organizers/:organizer_id/follow
 * follow an organizer
 */
subscriptionsRouter.post("/organizers/:organizer_id/follow", requireAuth(), ah(async (req, res) => {
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
}));

module.exports = subscriptionsRouter;