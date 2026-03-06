import request from "supertest";

const BASE_URL = "http://localhost:5050";

describe("Registration API", () => {
  const randomSuffix = Math.floor(Math.random() * 10000);
  const testUser = {
    name: "Test User",
    email: `testuser${randomSuffix}@example.com`,
    password: "password123",
    role: "user",
  };

  it("should register a new user successfully", async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBeDefined();
  });

  it("should return 409 when email is duplicated", async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(409);
  });

  it("should return 400 on validation error (short password)", async () => {
    const res = await request(BASE_URL)
      .post("/api/auth/register")
      .send({ ...testUser, email: `another${randomSuffix}@example.com`, password: "123" });

    expect(res.status).toBe(400);
  });
});
