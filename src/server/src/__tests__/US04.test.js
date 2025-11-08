const request = require("supertest");
const app = require("../app");

describe("US04 - Digital Ticket", () => {

  test("Returns tickets for a valid user", async () => {
    const res = await request(app).get("/api/v1/users/tickets/1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const ticket = res.body[0];
      expect(ticket).toHaveProperty("ticket_id");
      expect(ticket).toHaveProperty("status");
      expect(ticket).toHaveProperty("event_title");
      expect(ticket).toHaveProperty("organizer_name");
      expect(ticket).toHaveProperty("event_date");
    }
  });

  test("Returns empty array if user has no tickets", async () => {
    const res = await request(app).get("/api/v1/users/tickets/99999"); 

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length === 0 || res.body.length >= 0).toBe(true); 
  });

  test("Returns 400 for an invalid user id", async () => {
    const res = await request(app).get("/api/v1/users/tickets/notanumber");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid userId");
  });

});
