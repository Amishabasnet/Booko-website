
const BASE_URL = "http://localhost:5050/api/theaters";
const AUTH_URL = "http://localhost:5050/api/auth";

async function runTheaterTests() {
    console.log("🚀 Starting Theater CRUD API Tests...");

    const adminUser = {
        name: "Theater Admin",
        email: `theater_admin_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "admin"
    };

    const regularUser = {
        name: "Theater User",
        email: `theater_user_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "user"
    };

    // 0. Setup Users and get Tokens
    console.log("\n0️⃣ Setting up admin and user accounts...");
    await fetch(`${AUTH_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(adminUser) });
    await fetch(`${AUTH_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(regularUser) });

    const adminToken = await fetch(`${AUTH_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: adminUser.email, password: adminUser.password }) }).then(res => res.json()).then(d => d.token);
    const userToken = await fetch(`${AUTH_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: regularUser.email, password: regularUser.password }) }).then(res => res.json()).then(d => d.token);

    let theaterID: string;

    // 1. POST / (Admin)
    console.log("\n1️⃣ Testing Create Theater (Admin Only)...");
    const theaterData = {
        name: "Grand Cinema",
        location: "Downtown",
        totalScreens: 10
    };

    try {
        const res = await fetch(`${BASE_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
            body: JSON.stringify(theaterData)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 201 && data.success) {
            console.log("✅ Success: Theater created.");
            theaterID = data.theater._id;
        } else {
            console.error("❌ Failure: Admin could not create theater.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 2. GET / (Public)
    console.log("\n2️⃣ Testing GetAll Theaters (Public)...");
    try {
        const res = await fetch(`${BASE_URL}/`);
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success && Array.isArray(data.theaters)) {
            console.log("✅ Success: Theaters retrieved publically.");
        } else {
            console.error("❌ Failure: Public could not fetch theaters.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 3. PUT /:id (Admin)
    console.log("\n3️⃣ Testing Update Theater (Admin Only)...");
    try {
        const res = await fetch(`${BASE_URL}/${theaterID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
            body: JSON.stringify({ ...theaterData, name: "Grand Cinema Updated" })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success && data.theater.name === "Grand Cinema Updated") {
            console.log("✅ Success: Theater updated.");
        } else {
            console.error("❌ Failure: Admin could not update theater.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 4. RBAC Check: POST / (User should be Forbidden)
    console.log("\n4️⃣ Testing Create Theater (Regular User - Forbidden)...");
    try {
        const res = await fetch(`${BASE_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
            body: JSON.stringify(theaterData)
        });
        console.log("Status:", res.status);
        if (res.status === 403) {
            console.log("✅ Success: Regular user forbidden correctly (403).");
        } else {
            console.error("❌ Failure: Expected 403 for regular user.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 5. DELETE /:id (Admin)
    console.log("\n5️⃣ Testing Delete Theater (Admin Only)...");
    try {
        const res = await fetch(`${BASE_URL}/${theaterID}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        console.log("Status:", res.status);
        if (res.status === 200) {
            console.log("✅ Success: Theater deleted.");
        } else {
            console.error("❌ Failure: Admin could not delete theater.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }
}

runTheaterTests();
