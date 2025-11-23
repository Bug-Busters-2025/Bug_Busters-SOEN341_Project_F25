const request = require("supertest");
const app = require("../app");
const { pool } = require("../db");

describe("US13 - Organizer followers & subscribers", () => {
  beforeEach(async () => {
    await pool.execute(
      `
      DELETE FROM organizer_subscriptions
      WHERE organizer_id IN (?, ?) OR user_id IN (?, ?)
      `,
      [881, 882, 881, 882]
    );

    await pool.execute(
      "INSERT INTO organizer_subscriptions (user_id, organizer_id) VALUES (?, ?)",
      [881, 882]
    );
  });

  // ---------------------------------------------------------------------------
  // GET /organizers/:organizer_id/followers
  // ---------------------------------------------------------------------------

  test("GET /api/v1/subscriptions/organizers/:id/followers returns followers for that organizer", async () => {
    const res = await request(app).get(
      "/api/v1/subscriptions/organizers/882/followers"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("followers");
    expect(Array.isArray(res.body.followers)).toBe(true);

    expect(res.body.count).toBe(1);
    expect(res.body.followers).toHaveLength(1);

    const follower = res.body.followers[0];

    expect(follower).toMatchObject({
      user_id: 881,
      name: "Test Student",
      email: "student@example.com",
    });

    expect(follower).toHaveProperty("followed_at");
  });

  test("GET /api/v1/subscriptions/organizers/:id/followers returns empty list when organizer has no followers", async () => {
    await pool.execute(
      "DELETE FROM organizer_subscriptions WHERE organizer_id = ?",
      [882]
    );

    const res = await request(app).get(
      "/api/v1/subscriptions/organizers/882/followers"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("count", 0);
    expect(Array.isArray(res.body.followers)).toBe(true);
    expect(res.body.followers).toHaveLength(0);
  });

  test("GET /api/v1/subscriptions/organizers/:id/followers returns 400 on invalid organizer_id", async () => {
    const res = await request(app).get(
      "/api/v1/subscriptions/organizers/not-a-number/followers"
    );
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid organizer_id");
  });

  // ---------------------------------------------------------------------------
  // DELETE /organizers/:organizer_id/subscribers/:user_id
  // ---------------------------------------------------------------------------

  test("DELETE /api/v1/subscriptions/organizers/:id/subscribers/:user_id removes an existing subscriber", async () => {
    await pool.execute(
      `DELETE FROM organizer_subscriptions
      WHERE organizer_id IN (?, ?) OR user_id IN (?, ?)`,
      [881, 882, 881, 882]
    );

    await pool.execute(
      "INSERT INTO organizer_subscriptions (user_id, organizer_id) VALUES (?, ?)",
      [882, 881]
    );

    const resDelete = await request(app).delete(
      "/api/v1/subscriptions/organizers/881/subscribers/882"
    );

    expect(resDelete.statusCode).toBe(204);

    const [rows] = await pool.execute(
      `SELECT * FROM organizer_subscriptions
      WHERE organizer_id = ? AND user_id = ?`,
      [881, 882]
    );
    expect(rows).toHaveLength(0);
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/subscribers/:user_id returns 404 when subscription does not exist", async () => {
    await pool.execute(
      "DELETE FROM organizer_subscriptions WHERE organizer_id = ? AND user_id = ?",
      [881, 882]
    );
    const res = await request(app).delete(
      "/api/v1/subscriptions/organizers/881/subscribers/882"
    );

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Subscription not found");
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/subscribers/:user_id returns 400 on invalid IDs", async () => {
    const res1 = await request(app).delete(
      "/api/v1/subscriptions/organizers/not-a-number/subscribers/882"
    );
    expect(res1.statusCode).toBe(400);
    expect(res1.body).toHaveProperty(
      "error",
      "Invalid organizer_id or user_id"
    );

    const res2 = await request(app).delete(
      "/api/v1/subscriptions/organizers/881/subscribers/NaN"
    );
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toHaveProperty(
      "error",
      "Invalid organizer_id or user_id"
    );
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/subscribers/:user_id returns 403 if current user is not the organizer", async () => {
    const res = await request(app).delete(
      "/api/v1/subscriptions/organizers/882/subscribers/881"
    );

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty(
      "error",
      "Only this organizer can remove subscribers"
    );
  });
});

afterAll(async () => {
  await pool.end();
});