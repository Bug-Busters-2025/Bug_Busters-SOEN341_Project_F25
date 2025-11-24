const request = require("supertest");
const app = require("../app");
const { pool } = require("../db");

beforeEach(async () => {
  await pool.execute(
    "INSERT IGNORE INTO organizer_subscriptions (user_id, organizer_id) VALUES (?, ?)",
    [881, 882]
  );
});

describe("US06 - Organizer Analytics Routes", () => {
  test("GET /api/v1/events/organizer/:organizer_id returns events for that organizer", async () => {
    const res = await request(app).get("/api/v1/events/organizer/882");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    res.body.forEach((evt) => {
      expect(evt).toHaveProperty("id");
      expect(evt).toHaveProperty("organizer_id", 882);
      expect(evt).toHaveProperty("title");
      expect(evt).toHaveProperty("event_date");
      expect(evt).toHaveProperty("ticket_capacity");
      expect(evt).toHaveProperty("remaining_tickets");
    });

    const titles = res.body.map((e) => e.title);
    expect(titles).toEqual(
      expect.arrayContaining(["Campus Concert", "Tech Talk"])
    );
  });

  test("GET /api/v1/events/organizer/:organizer_id returns 404 when organizer has no events", async () => {
    const res = await request(app).get("/api/v1/events/organizer/9999");
    expect(res.statusCode).toBe(404);
    expect(res.text).toContain("No events found for this organizer");
  });

  test("GET /api/v1/subscriptions/organizers/:organizer_id/followers returns followers for that organizer", async () => {
    const res = await request(app).get(
      "/api/v1/subscriptions/organizers/882/followers"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("count");
    expect(res.body).toHaveProperty("followers");
    expect(Array.isArray(res.body.followers)).toBe(true);

    const followerIds = res.body.followers.map((f) => f.user_id);
    expect(followerIds).toContain(881);

    const testStudent = res.body.followers.find((f) => f.user_id === 881);
    expect(testStudent).toMatchObject({
      user_id: 881,
      name: "Test Student",
      email: "student@example.com",
    });
  });
});

afterAll(async () => {
  await pool.end();
});