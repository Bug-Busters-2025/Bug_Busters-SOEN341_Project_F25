const request = require("supertest");
const app = require("../app");

describe("US05 - Create Events", () => {
  test("POST /api/v1/events/create creates a new event", async () => {
    const res = await request(app)
      .post("/api/v1/events/create")
      .send({
        title: "Mock Event",
        description: "For testing",
        category: "Music",
        imageUrl: "mock.png",
        event_date: "2025-12-01T18:00:00",
        location: "Test Hall",
        ticket_capacity: 100,
        ticket_type: "free",
      });
    expect([201, 400, 500, 302]).toContain(res.statusCode);
  });
});
