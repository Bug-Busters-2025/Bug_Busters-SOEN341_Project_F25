const request = require("supertest");
const app = require("../app"); 

describe("US01 - Event Discovery", () => {
  test("GET /api/v1/events returns only PUBLISHED events with required fields", async () => {
    const res = await request(app).get("/api/v1/events");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach(event => {
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("event_date");
      expect(event).toHaveProperty("location");
      expect(event.status).toBe("PUBLISHED");
    });
  });
});


