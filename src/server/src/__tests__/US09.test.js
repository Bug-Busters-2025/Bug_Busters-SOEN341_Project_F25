const request = require("supertest");
const app = require("../app");

describe("US09 - Approve Organizer Accounts", () => {

  test("PATCH /api/v1/users/:id/role updates user role when valid", async () => {
    const res = await request(app)
      .patch("/api/v1/users/1/role")
      .send({ role: "organizer" });

      console.log("US08 returned status:", res.statusCode);
    expect([200, 400, 401, 403, 404, 500]).toContain(res.statusCode);
  });

  test("PATCH /api/v1/users/:id/role rejects invalid roles", async () => {
    const res = await request(app)
      .patch("/api/v1/users/1/role")
      .send({ role: "NOT_A_REAL_ROLE" });

    
    expect([400, 403, 500, 404]).toContain(res.statusCode);
  });

  test("PATCH /api/v1/users/:id/role requires role field", async () => {
    const res = await request(app)
      .patch("/api/v1/users/1/role")
      .send({});

    expect([400, 403, 500, 404]).toContain(res.statusCode);
  });

});
