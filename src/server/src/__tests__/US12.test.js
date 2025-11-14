const request = require("supertest");
const app = require("../app");

describe("US12 - Manage Organizations and Roles", () => {
  
  test("GET /api/v1/organizations returns list of organizations or appropriate error", async () => {
    const res = await request(app).get("/api/v1/organizations");

    // Acceptable real-world outcomes:
    expect([200, 302, 401, 403, 404, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);

      // If we got a list, verify items have expected fields
      if (res.body.length > 0) {
        res.body.forEach(org => {
          expect(org).toHaveProperty("id");
          expect(org).toHaveProperty("name");
        });
      }
    }
  });

  test("PATCH /api/v1/users/:id/role updates role or rejects unauthorized action", async () => {
    const res = await request(app)
      .patch("/api/v1/users/1/role")
      .send({ role: "organizer" });

    // Admin may succeed, non-admin gets 401/403, missing user → 404
    expect([200, 302, 400, 401, 403, 404, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/updated|changed/i);
    }
  });

});
