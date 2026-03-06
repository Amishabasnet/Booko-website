import request from "supertest";

const BASE_URL = "http://localhost:5050";

describe("Booking API", () => {
  let userToken: string;
  let adminToken: string;
  let showtimeId: string;

  beforeAll(async () => {
    // create a regular user
    const user = { name: "Booking User", email: `bookuser${Date.now()}@example.com`, password: "pass1234" };
    await request(BASE_URL).post("/api/auth/register").send(user);
    const loginRes = await request(BASE_URL).post("/api/auth/login").send({ email: user.email, password: user.password });
    userToken = loginRes.body.token;

    // create admin
    const admin = { name: "Booking Admin", email: `bookadmin${Date.now()}@example.com`, password: "pass1234", role: "admin" };
    await request(BASE_URL).post("/api/auth/register").send(admin);
    const adminLogin = await request(BASE_URL).post("/api/auth/login").send({ email: admin.email, password: admin.password });
    adminToken = adminLogin.body.token;

    // helper to assert success
    const safe = (res: any, description: string) => {
      if (![200, 201].includes(res.status)) {
        throw new Error(`${description} failed: ${res.status} ${JSON.stringify(res.body)}`);
      }
    };

    // create a movie
    const movie = await request(BASE_URL)
      .post("/api/movies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Movie",
        description: "Desc",
        genre: ["Test"],
        duration: 100,
        language: "English",
        releaseDate: "2021-01-01T00:00:00.000Z",
        posterImage: "",
      });
    safe(movie, "movie creation");
    const movieId = movie.body.movie._id;

    const theater = await request(BASE_URL)
      .post("/api/theaters")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Test Theater", location: "Nowhere", totalScreens: 1 });
    safe(theater, "theater creation");
    const theaterId = theater.body.theater?._id;
    if (!theaterId) throw new Error("theater id not returned");

    const screen = await request(BASE_URL)
      .post("/api/screens")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        theaterId,
        screenName: "Main Screen",
        totalSeats: 10,
        seatLayout: [
          [{ row: "A", col: 1 }, { row: "A", col: 2 }]
        ]
      });
    safe(screen, "screen creation");
    const screenId = screen.body.screen?._id;
    if (!screenId) throw new Error("screen id not returned");

    const showtime = await request(BASE_URL)
      .post("/api/showtimes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ movieId, theaterId, screenId, showDate: "2025-01-01", showTime: "18:00", ticketPrice: 100 });
    safe(showtime, "showtime creation");
    showtimeId = showtime.body.showtime._id;
  });

  it("regular user can create a booking and customer snapshot is set", async () => {
    const res = await request(BASE_URL)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ showtimeId, selectedSeats: ["A1"], totalAmount: 100 });

    expect(res.status).toBe(201);
    expect(res.body.booking.customerName).toBe("Booking User");
    expect(res.body.booking.customerEmail).toBeDefined();
  });

  it("admin can create a booking for another user", async () => {
    // fetch user id via profile
    const profileRes = await request(BASE_URL)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${userToken}`);
    const userId = profileRes.body.id || profileRes.body.user.id;

    const res = await request(BASE_URL)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ showtimeId, selectedSeats: ["A2"], totalAmount: 100, userId });

    expect(res.status).toBe(201);
    expect(res.body.booking.customerName).toBe("Booking User");
  });

  it("admin route returns populated customer info", async () => {
    const res = await request(BASE_URL)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    // ensure at least one has non-admin snapshot
    expect(res.body.bookings.some((b: any) => b.customerName && b.customerName !== "Admin User")).toBe(true);
  });
});
