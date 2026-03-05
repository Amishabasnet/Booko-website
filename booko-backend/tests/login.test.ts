import request from "supertest";

const BASE_URL = "http://localhost:5050";

describe("Auth API - Login", () => {

  const testUser = {
    name: "Login Test User",
    email: `login_test_${Math.floor(Math.random() * 100000)}@example.com`,
    password: "password123",
  };

  beforeAll(async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/register")
      .send(testUser);

    // allow common outcomes
    expect([200, 201, 400, 409]).toContain(res.statusCode);
  });

  it("logs in successfully with valid credentials", async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toBeDefined();
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect([400, 401]).toContain(res.statusCode);
  });

  it("returns 400/422 when password is missing", async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
      });

    expect([400, 422]).toContain(res.statusCode);
  });

});