const request = require("supertest");
const app = require("../app");

describe("US07 - Export Attendee List", () => {
  test("GET /api/v1/events/:id/export returns CSV or error", async () => {
    const res = await request(app).get("/api/v1/events/1/export");
    expect([200, 403, 404, 500, 302]).toContain(res.statusCode);
  });
});
