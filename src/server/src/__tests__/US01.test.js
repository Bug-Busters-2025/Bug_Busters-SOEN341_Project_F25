const request = require("supertest");
const app = require("../app"); 

describe("US01 - Event Discovery", () => {
  test("GET /api/v1/events returns 200 and list of events", async () => {
    const res = await request(app).get("/api/v1/events");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

