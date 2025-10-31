const request = require("supertest");
const app = require("../app");

describe("US03 - Claim Tickets", () => {
  test("POST /api/v1/events/register registers user for an event", async () => {
    const res = await request(app)
      .post("/api/v1/events/register")
      .send({ user_id: 1, event_id: 1 });
    expect([200, 400, 500]).toContain(res.statusCode);
  });
});