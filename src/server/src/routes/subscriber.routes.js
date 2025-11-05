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

module.exports = subscriberRouter;