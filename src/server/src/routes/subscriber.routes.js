const { Router } = require("express");
const { pool } = require("../db");
const { requireAuth, getAuth } = require("@clerk/express");

const subscriberRouter = Router();

const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

async function getMysqlUserId(req) {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
    }
    const [rows] = await pool.execute(
        "SELECT id FROM users WHERE clerk_id = ? LIMIT 1",
        [clerkId]
    );
    if (rows.length === 0) {
        const err = new Error("User not found for this Clerk account");
        err.status = 404;
        throw err;
    }
    return rows[0].id;
}

function toInt(v) {
    const n = Number(v);
    return Number.isInteger(n) ? n : null;
}

/**
 * GET /organizers/:org_id/followers
 * list followers for an organizer
 */
subscriberRouter.get("/organizers/:org_id/followers", requireAuth(), ah(async (req, res) => {
    const orgId = toInt(req.params.org_id);
    if (!orgId) return res.status(400).json({ error: "Invalid org_id" });

    const [rows] = await pool.execute (
        `SELECT u.id, u.name, u.email
         FROM organizer_subscriptions os
         JOIN users u ON u.id = os.user_id
        WHERE os.org_id = ?
        ORDER BY u.name ASC`,
        [orgId]
    );

    res.json({ count: rows.length, followers: rows });
}));


subscriberRouter.delete("/organizers/:organizer_id/subscribers/:user_id", requireAuth(), ah(async (req, res) => {
    const { userId: clerkId } = getAuth(req);

    const [[me]] = await pool.execute(
        "SELECT id, role FROM users WHERE clerk_id = ? LIMIT 1",
        [clerkId]
    );
    if (!me) return res.status(404).json({ error: "User not found" });

    const organizerId = Number(req.params.organizer_id);
    const subscriberId = Number(req.params.user_id);
    if (!Number.isInteger(organizerId) || !Number.isInteger(subscriberId)) {
        return res.status(400).json({ error: "Invalid organizer_id or user_id" });
    }

    if (me.id !== organizerId) {
        return res.status(403).json({ error: "You can only manage your own subscribers" });
    }
    if (me.role !== "organizer") {
        return res.status(403).json({ error: "Only organizers can remove subscribers" });
    }

    const [result] = await pool.execute(
        `DELETE FROM organizer_subscriptions
        WHERE organizer_id = ? AND user_id = ?`,
        [organizerId, subscriberId]
    );

    if (result.affectedRows > 0) return res.status(204).send();
    return res.status(404).json({ error: "Subscription not found" });
}));


/**
 * DELETE /organizers/:org_id/follow
 * delete from organizer_subscriptions
 */
subscriberRouter.delete("/organizers/:org_id/follow", requireAuth(), ah(async (req, res) => {
    const userId = await getMysqlUserId(req);
    const orgId = toInt(req.params.org_id);
    if (!orgId) return res.status(400).json({ error: "Invalid org_id" });

    const [result] = await pool.execute(
        `DELETE FROM organizer_subscriptions
        WHERE user_id = ? AND org_id = ?`,
        [userId, orgId]
    );

    if (result.affectedRows > 0) return res.status(204).send();
    return res.status(200).json({ followed: false, deleted: false });
}));

module.exports = subscriberRouter;