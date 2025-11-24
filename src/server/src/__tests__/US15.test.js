const request = require("supertest");
const app = require("../app");
const { pool } = require("../db");

beforeEach(async () => {
  await pool.execute(
    "DELETE FROM organizer_subscriptions WHERE user_id = ?",
    [881]
  );
});

describe("US15 - Subscribe to organizers", () => {
  test("POST /api/v1/subscriptions/organizers/:id/follow creates a new subscription", async () => {
    const res = await request(app)
      .post("/api/v1/subscriptions/organizers/882/follow");

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("followed", true);
    expect(res.body).toHaveProperty("created", true);

    const [rows] = await pool.execute(
      "SELECT * FROM organizer_subscriptions WHERE user_id = ? AND organizer_id = ?",
      [881, 882]
    );
    expect(rows.length).toBe(1);
  });

  test("POST /api/v1/subscriptions/organizers/:id/follow is idempotent", async () => {
    const first = await request(app)
      .post("/api/v1/subscriptions/organizers/883/follow");

    expect([200, 201]).toContain(first.statusCode);
    expect(first.body).toHaveProperty("followed", true);
    expect(first.body).toHaveProperty("created", true);

    const second = await request(app)
      .post("/api/v1/subscriptions/organizers/883/follow");

    expect([200, 201]).toContain(second.statusCode);
    expect(second.body).toHaveProperty("followed", true);
    expect(second.body).toHaveProperty("created", false);

    const [rows] = await pool.execute(
      "SELECT * FROM organizer_subscriptions WHERE user_id = ? AND organizer_id = ?",
      [881, 883]
    );
    expect(rows.length).toBe(1);
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/follow removes an existing subscription", async () => {
    await pool.execute(
      "INSERT INTO organizer_subscriptions (user_id, organizer_id) VALUES (?, ?)",
      [881, 882]
    );

    const res = await request(app)
      .delete("/api/v1/subscriptions/organizers/882/follow");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("removed", true);

    const [rows] = await pool.execute(
      "SELECT * FROM organizer_subscriptions WHERE user_id = ? AND organizer_id = ?",
      [881, 882]
    );
    expect(rows.length).toBe(0);
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/follow on a non-followed organizer returns removed=false", async () => {
    const [before] = await pool.execute(
      "SELECT * FROM organizer_subscriptions WHERE user_id = ? AND organizer_id = ?",
      [881, 882]
    );
    expect(before.length).toBe(0);

    const res = await request(app)
      .delete("/api/v1/subscriptions/organizers/882/follow");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("removed", false);

    const [after] = await pool.execute(
      "SELECT * FROM organizer_subscriptions WHERE user_id = ? AND organizer_id = ?",
      [881, 882]
    );
    expect(after.length).toBe(0);
  });

  test("POST /api/v1/subscriptions/organizers/:id/follow returns 400 on invalid organizer_id", async () => {
    const res = await request(app)
      .post("/api/v1/subscriptions/organizers/not-a-number/follow");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid organizer_id");
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/follow returns 400 on invalid organizer_id", async () => {
    const res = await request(app)
      .delete("/api/v1/subscriptions/organizers/NaN/follow");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid organizer_id");
  });
});

afterAll(async () => {
  await pool.end();
});