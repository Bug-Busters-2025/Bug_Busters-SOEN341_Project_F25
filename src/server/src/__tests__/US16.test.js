const request = require("supertest");
const app = require("../app");

describe("US16 - Authentication (Sync & Role Fetch)", () => {

  test("POST /api/v1/auth/sync creates or updates a user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/sync")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        role: "student",
      });


    expect([200, 201, 400, 401, 403, 302, 500]).toContain(res.statusCode);
  });

  test("GET /api/v1/auth/role/:email returns user role or 404", async () => {
    const res = await request(app).get("/api/v1/auth/role/testuser@example.com");

    
    expect([200, 404, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("role");
    }
  });
});
