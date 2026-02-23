
const BASE_URL = "http://localhost:5050/api/screens";
const THEATER_URL = "http://localhost:5050/api/theaters";
const AUTH_URL = "http://localhost:5050/api/auth";

async function runScreenTests() {
    console.log("🚀 Starting Screen API Tests...");

    const adminUser = {
        name: "Screen Admin",
        email: `screen_admin_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "admin"
    };

    // 0. Setup Admin and Theater
    console.log("\n0️⃣ Setting up admin and theater...");
    await fetch(`${AUTH_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(adminUser) });
    const adminToken = await fetch(`${AUTH_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: adminUser.email, password: adminUser.password }) }).then(res => res.json()).then(d => d.token);

    const theaterRes = await fetch(`${THEATER_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
        body: JSON.stringify({ name: "Screen Test Theater", location: "Test City", totalScreens: 5 })
    });
    const theaterData = await theaterRes.json();
    const theaterId = theaterData.theater._id;

    let screenID: string;

    // 1. POST / (Admin)
    console.log("\n1️⃣ Testing Create Screen (Admin Only)...");
    const screenData = {
        theaterId,
        screenName: "Screen 1",
        totalSeats: 50,
        seatLayout: [
            [{ row: "A", col: 1, type: "normal" }, { row: "A", col: 2, type: "normal" }],
            [{ row: "B", col: 1, type: "premium" }, { row: "B", col: 2, type: "premium" }]
        ]
    };

    try {
        const res = await fetch(`${BASE_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
            body: JSON.stringify(screenData)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 201 && data.success) {
            console.log("✅ Success: Screen created.");
            screenID = data.screen._id;
        } else {
            console.error("❌ Failure: Admin could not create screen.");
            console.error(JSON.stringify(data, null, 2));
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 2. GET /:theaterId (Public)
    console.log("\n2️⃣ Testing Get Screens by Theater (Public)...");
    try {
        const res = await fetch(`${BASE_URL}/${theaterId}`);
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success && Array.isArray(data.screens)) {
            console.log("✅ Success: Screens retrieved publically.");
        } else {
            console.error("❌ Failure: Public could not fetch screens.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 3. PUT /:id (Admin)
    console.log("\n3️⃣ Testing Update Screen (Admin Only)...");
    try {
        const res = await fetch(`${BASE_URL}/${screenID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
            body: JSON.stringify({ ...screenData, screenName: "Screen 1 Updated" })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success && data.screen.screenName === "Screen 1 Updated") {
            console.log("✅ Success: Screen updated.");
        } else {
            console.error("❌ Failure: Admin could not update screen.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 4. DELETE /:id (Admin)
    console.log("\n4️⃣ Testing Delete Screen (Admin Only)...");
    try {
        const res = await fetch(`${BASE_URL}/${screenID}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        console.log("Status:", res.status);
        if (res.status === 200) {
            console.log("✅ Success: Screen deleted.");
        } else {
            console.error("❌ Failure: Admin could not delete screen.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }
}

runScreenTests();
