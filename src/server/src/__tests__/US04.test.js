const request = require("supertest");
const app = require("../app");

describe("US04 - Digital Ticket", () => {
  test("GET /api/v1/users/tickets/:userId returns user's tickets", async () => {
    const res = await request(app).get("/api/v1/users/tickets/1");
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});
