import request from "supertest";

const BASE_URL = "http://localhost:5050";

describe("Movie API", () => {
  const adminUser = {
    name: "Movie Admin",
    email: `movie_admin_${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
    role: "admin",
  };
  const regularUser = {
    name: "Movie User",
    email: `movie_user_${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
    role: "user",
  };

  let adminToken: string;
  let userToken: string;
  let movieID: string;

  const movieData = {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
    genre: ["Sci-Fi", "Action"],
    duration: 148,
    language: "English",
    releaseDate: "2010-07-16T00:00:00.000Z",
    posterImage: "http://example.com/inception.jpg",
  };

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

  it("allows admin to create, update, and delete a movie", async () => {
    const createRes = await request(BASE_URL)
      .post("/api/movies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(movieData);
    expect(createRes.status).toBe(201);
    movieID = createRes.body.movie._id;

    const updateRes = await request(BASE_URL)
      .put(`/api/movies/${movieID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...movieData, title: "Inception Updated" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.movie.title).toBe("Inception Updated");

    const deleteRes = await request(BASE_URL)
      .delete(`/api/movies/${movieID}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(200);
  });

  it("allows public to list movies", async () => {
    const res = await request(BASE_URL).get("/api/movies");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.movies)).toBe(true);
  });

  it("forbids regular user from creating a movie", async () => {
    const res = await request(BASE_URL)
      .post("/api/movies")
      .set("Authorization", `Bearer ${userToken}`)
      .send(movieData);
    expect(res.status).toBe(403);
  });
});
