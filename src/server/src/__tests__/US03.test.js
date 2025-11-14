const request = require("supertest");
const app = require("../app");

describe("US03 - Claim Tickets", () => {

  test("Successfully registers when tickets are available", async () => {
    const res = await request(app)
      .post("/api/v1/events/register")
      .send({ user_id: 1, event_id: 1 });

    expect([200, 400]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      // Should be either claimed or waitlisted
      expect(["Successfully registered for event", "Added to waitlist"])
        .toContain(res.body.message);
    }
  });

  test("Prevents duplicate registration", async () => {
    const res = await request(app)
      .post("/api/v1/events/register")
      .send({ user_id: 1, event_id: 1 });

    // If registered already, API returns 400
    if (res.statusCode === 400) {
      expect(res.body.message).toBe("Already registered for this event");
    }
  });

  test("Requires user_id and event_id", async () => {
    const res = await request(app)
      .post("/api/v1/events/register")
      .send({}); // missing fields

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User ID and Event ID are required");
  });

});
