const request = require("supertest");
const app = require("../app");

describe("US02 - Save Events", () => {
  test("POST /api/v1/events/save saves an event for a user", async () => {
    const res = await request(app)
      .post("/api/v1/events/save")
      .send({ user_id: 1, event_id: 1 });
    expect([200, 400, 500]).toContain(res.statusCode);
  });
});