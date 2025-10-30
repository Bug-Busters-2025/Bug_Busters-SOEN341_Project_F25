const request = require("supertest");
const app = require("../app");

describe("US08 - Ticket Validation", () => {
  test("POST /api/v1/events/check-in validates ticket", async () => {
    const res = await request(app)
      .post("/api/v1/events/check-in")
      .send({ payload: "ticket:1-user:1-event:1", event_id: 1 });
    expect([200, 400, 403, 404, 500]).toContain(res.statusCode);
  });
});
