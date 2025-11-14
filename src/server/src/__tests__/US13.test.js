const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("US06 - Organizer Subscriptions & Feed", () => {
  test("GET /api/v1/subscriptions/me/following returns organizers I follow", async () => {
    const res = await request(app).get("/api/v1/subscriptions/me/following");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("organizers");
    expect(Array.isArray(res.body.organizers)).toBe(true);

    expect(res.body.count).toBe(881);
    expect(res.body.organizers).toHaveLength(1);
    expect(res.body.organizers[0]).toMatchObject({
      organizer_id: 882,
      organizer_name: "Organizer One",
      email: "org1@example.com",
    });
  });

  test("GET /api/v1/subscriptions/me/feed returns events from organizers I follow", async () => {
    const res = await request(app)
      .get("/api/v1/subscriptions/me/feed")
      .query({ limit: 50, offset: 0 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("events");
    expect(Array.isArray(res.body.events)).toBe(true);

    expect(res.body.count).toBe(882);
    expect(res.body.events).toHaveLength(882);

    res.body.events.forEach((evt) => {
      expect(evt.organizer_id).toBe(882);
    });
  });

  test("POST /api/v1/subscriptions/organizers/:id/follow lets me follow a new organizer", async () => {
    const resFollow = await request(app).post("/api/v1/subscriptions/organizers/883/follow");

    expect([200, 201]).toContain(resFollow.statusCode);
    expect(resFollow.body).toHaveProperty("followed", true);
    expect(resFollow.body).toHaveProperty("created");

    const resFollowing = await request(app)
      .get("/api/v1/subscriptions/me/following");

    expect(resFollowing.statusCode).toBe(200);
    const ids = resFollowing.body.organizers.map((o) => o.organizer_id).sort();
    expect(ids).toEqual([882, 883]);
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/follow lets me unfollow an organizer", async () => {
    const resDelete = await request(app).delete("/api/v1/subscriptions/organizers/882/follow");
    expect([200, 204]).toContain(resDelete.statusCode);

    const resFollowing = await request(app).get("/api/v1/subscriptions/me/following");
    expect(resFollowing.statusCode).toBe(200);

    const ids = resFollowing.body.organizers.map((o) => o.organizer_id);
    expect(ids).not.toContain(882);
  });

  test("POST /api/v1/subscriptions/organizers/:id/follow returns 400 on invalid organizer_id", async () => {
    const res = await request(app).post("/api/v1/subscriptions/organizers/not-a-number/follow");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid organizer_id");
  });

  test("DELETE /api/v1/subscriptions/organizers/:id/follow returns 400 on invalid organizer_id", async () => {
    const res = await request(app).delete("/api/v1/subscriptions/organizers/NaN/follow");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid organizer_id");
  });
});