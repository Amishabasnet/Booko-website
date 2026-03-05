
const BASE_URL = "http://localhost:5050/api/auth";

async function runLoginTests() {
    console.log("Starting Login API Tests...");

    const testUser = {
        name: "Login Test User",
        email: `login_test_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
    };

    // 0. Register the user first
    console.log("\nPre-registering user...");
    await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser)
    });

    // 1. Test Successful Login
    console.log("\n Testing Successful Login...");
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (res.status === 200 && data.success && data.token && data.user) {
            console.log(" Success: User logged in, token received.");
        } else {
            console.error("Failure: Unexpected response format or status code");
        }
    } catch (err) {
        console.error("Error during login:", err instanceof Error ? err.message : String(err));
    }

    // 2. Test Invalid Credentials (Wrong Password)
    console.log("\nTesting Invalid Credentials (Wrong Password)...");
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testUser.email, password: "wrongpassword" })
        });
        const data = await res.json();
        console.log("Status:", res.status);

        if (res.status === 401) {
            console.log(" Success: Invalid credentials correctly handled with 401");
        } else {
            console.error(" Failure: Expected 401 for wrong password");
        }
    } catch (err) {
        console.error(" Error during invalid credentials test:", err instanceof Error ? err.message : String(err));
    }

    // 3. Test Validation Error (Missing Password)
    console.log("\n Testing Validation Error (Missing Password)...");
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testUser.email })
        });
        const data = await res.json();
        console.log("Status:", res.status);

        if (res.status === 400) {
            console.log(" Success: Validation error correctly handled with 400");
        } else {
            console.error(" Failure: Expected 400 for missing password");
        }
    } catch (err) {
        console.error(" Error during validation test:", err instanceof Error ? err.message : String(err));
    }
}

runLoginTests();
