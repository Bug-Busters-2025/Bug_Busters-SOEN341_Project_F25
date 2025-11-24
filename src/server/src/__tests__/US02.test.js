const request = require("supertest");
const app = require("../app");

describe("US02 - Save Events", () => {
  test("POST /api/v1/events/save saves an event for a user (success case)", async () => {
    const res = await request(app)
      .post("/api/v1/events/save")
      .send({ user_id: 1, event_id: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("insertId"); 
  });

  test("POST /api/v1/events/save returns 400 when user_id is missing", async () => {
    const res = await request(app)
      .post("/api/v1/events/save")
      .send({ event_id: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("User ID and event ID are required");
  });

  test("POST /api/v1/events/save returns 400 when event_id is missing", async () => {
    const res = await request(app)
      .post("/api/v1/events/save")
      .send({ user_id: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("User ID and event ID are required");
  });
});
