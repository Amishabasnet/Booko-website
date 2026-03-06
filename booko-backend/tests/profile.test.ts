import request from "supertest";

const BASE_URL = "http://localhost:5050";

describe("Profile API", () => {
  const user = {
    name: "Profile Test User",
    email: `profile_test_${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
  };

  let token: string;

  beforeAll(async () => {
    await request(BASE_URL).post("/api/auth/register").send(user);
    const res = await request(BASE_URL)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    token = res.body.token;
  });

  it("retrieves profile with valid token", async () => {
    const res = await request(BASE_URL)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("returns 401 for invalid token", async () => {
    const res = await request(BASE_URL)
      .get("/api/auth/profile")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(401);
  });

  it("returns 401 when token missing", async () => {
    const res = await request(BASE_URL).get("/api/auth/profile");
    expect(res.status).toBe(401);
  });
});
