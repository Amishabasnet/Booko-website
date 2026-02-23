
const BASE_URL = "http://localhost:5050/api/auth";

async function runProfileTests() {
    console.log("🚀 Starting Profile API Tests...");

    const testUser = {
        name: "Profile Test User",
        email: `profile_test_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
    };

    // 0. Register and Login
    console.log("\n0️⃣ Pre-registering and logging in user...");
    await fetch(`${BASE_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testUser) });
    const loginRes = await fetch(`${BASE_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: testUser.email, password: testUser.password }) }).then(res => res.json());
    const token = loginRes.token;

    // 1. Test Successful Profile Retrieval
    console.log("\n1️⃣ Testing Successful Profile Retrieval...");
    try {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (res.status === 200 && data.success && data.user && !data.user.passwordHash) {
            console.log("✅ Success: Profile retrieved correctly, password excluded.");
        } else {
            console.error("❌ Failure: Unexpected response format or presence of password.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 2. Test Unauthorized (Invalid Token)
    console.log("\n2️⃣ Testing Unauthorized Profile Retrieval (Invalid Token)...");
    try {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer invalidtoken` }
        });
        console.log("Status:", res.status);
        if (res.status === 401) {
            console.log("✅ Success: Invalid token correctly handled (401).");
        } else {
            console.error("❌ Failure: Expected 401 for invalid token.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }

    // 3. Test Unauthorized (Missing Token)
    console.log("\n3️⃣ Testing Unauthorized Profile Retrieval (Missing Token)...");
    try {
        const res = await fetch(`${BASE_URL}/profile`, { method: "GET" });
        console.log("Status:", res.status);
        if (res.status === 401) {
            console.log("✅ Success: Missing token correctly handled (401).");
        } else {
            console.error("❌ Failure: Expected 401 for missing token.");
        }
    } catch (err: any) { console.error("❌ Error:", err.message); }
}

runProfileTests();
