
const BASE_URL = "http://localhost:5050/api/movies";
const AUTH_URL = "http://localhost:5050/api/auth";

async function runMovieTests() {
    console.log("🚀 Starting Movie CRUD API Tests...");

    const adminUser = {
        name: "Movie Admin",
        email: `movie_admin_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "admin"
    };

    const regularUser = {
        name: "Movie User",
        email: `movie_user_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "user"
    };

    // 0. Setup Users and get Tokens
    console.log("\n Setting up admin and user accounts...");
    await fetch(`${AUTH_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(adminUser) });
    await fetch(`${AUTH_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(regularUser) });

    const adminToken = await fetch(`${AUTH_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: adminUser.email, password: adminUser.password }) }).then(res => res.json()).then(d => d.token);
    const userToken = await fetch(`${AUTH_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: regularUser.email, password: regularUser.password }) }).then(res => res.json()).then(d => d.token);

    let movieID: string = "";

    // 1. POST / (Admin)
    console.log("\n Testing Create Movie (Admin Only)...");
    const movieData = {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
        genre: ["Sci-Fi", "Action"],
        duration: 148,
        language: "English",
        releaseDate: "2010-07-16T00:00:00.000Z",
        posterImage: "http://example.com/inception.jpg"
    };

    try {
        const res = await fetch(`${BASE_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
            body: JSON.stringify(movieData)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 201 && data.success) {
            console.log(" Success: Movie created.");
            movieID = data.movie._id;
        } else {
            console.error(" Failure: Admin could not create movie.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }

    // 2. GET / (Public)
    console.log("\n Testing GetAll Movies (Public)...");
    try {
        const res = await fetch(`${BASE_URL}/`);
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success && Array.isArray(data.movies)) {
            console.log(" Success: Movies retrieved publically.");
        } else {
            console.error(" Failure: Public could not fetch movies.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }

    // 3. PUT /:id (Admin)
    console.log("\n Testing Update Movie (Admin Only)...");
    try {
        const res = await fetch(`${BASE_URL}/${movieID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
            body: JSON.stringify({ ...movieData, title: "Inception Updated" })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success && data.movie.title === "Inception Updated") {
            console.log(" Success: Movie updated.");
        } else {
            console.error(" Failure: Admin could not update movie.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }

    // 4. RBAC Check: POST / (User should be Forbidden)
    console.log("\n Testing Create Movie (Regular User - Forbidden)...");
    try {
        const res = await fetch(`${BASE_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
            body: JSON.stringify(movieData)
        });
        console.log("Status:", res.status);
        if (res.status === 403) {
            console.log(" Success: Regular user forbidden correctly (403).");
        } else {
            console.error(" Failure: Expected 403 for regular user.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }

    // 5. DELETE /:id (Admin)
    console.log("\n Testing Delete Movie (Admin Only)...");
    try {
        const res = await fetch(`${BASE_URL}/${movieID}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        console.log("Status:", res.status);
        if (res.status === 200) {
            console.log(" Success: Movie deleted.");
        } else {
            console.error(" Failure: Admin could not delete movie.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }
}

runMovieTests();
