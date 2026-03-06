import request from "supertest";

const BASE_URL = "http://localhost:5050";

describe("RBAC middleware", () => {
  const adminUser = {
    name: "Admin User",
    email: `admin_${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
    role: "admin",
  };
  const regularUser = {
    name: "Regular User",
    email: `user_${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
    role: "user",
  };

  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    await request(BASE_URL).post("/api/auth/register").send(adminUser);
    await request(BASE_URL).post("/api/auth/register").send(regularUser);

    const ares = await request(BASE_URL)
      .post("/api/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = ares.body.token;

    const ures = await request(BASE_URL)
      .post("/api/auth/login")
      .send({ email: regularUser.email, password: regularUser.password });
    userToken = ures.body.token;
  });

  // use movie creation endpoint to test RBAC
  it("allows admin to create a movie", async () => {
    const res = await request(BASE_URL)
      .post("/api/movies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "RBAC Test",
        description: "desc",
        genre: ["test"],
        duration: 90,
        language: "English",
        releaseDate: "2021-01-01",
        posterImage: "",
      });
    expect([200,201]).toContain(res.status);
  });

  it("forbids regular user from creating a movie", async () => {
    const res = await request(BASE_URL)
      .post("/api/movies")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "RBAC Test",
        description: "desc",
        genre: ["test"],
        duration: 90,
        language: "English",
        releaseDate: "2021-01-01",
        posterImage: "",
      });
    expect(res.status).toBe(403);
  });

  it("returns 401 when token missing for movie creation", async () => {
    const res = await request(BASE_URL).post("/api/movies").send({});
    expect(res.status).toBe(401);
  });
});
