
const BASE_URL = "http://localhost:5050/api/auth";

async function runTests() {
    console.log("🚀 Starting Registration API Tests...");

    const randomSuffix = Math.floor(Math.random() * 10000);
    const testUser = {
        name: "Test User",
        email: `testuser${randomSuffix}@example.com`,
        password: "password123",
        role: "user"
    };

    // 1. Test Successful Registration
    console.log("\n1️⃣ Testing Successful Registration...");
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (res.status === 201 && data.success && data.user && data.user.id) {
            console.log("✅ Success: User registered with ID:", data.user.id);
        } else {
            console.error("❌ Failure: Unexpected response format or status code");
        }
    } catch (err) {
        console.error("❌ Error during registration:", err.message);
    }

    // 2. Test Duplicate Email
    console.log("\n2️⃣ Testing Duplicate Email Registration...");
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (res.status === 409) {
            console.log("✅ Success: Duplicate email correctly handled with 409");
        } else {
            console.error("❌ Failure: Expected 409 for duplicate email");
        }
    } catch (err) {
        console.error("❌ Error during duplicate test:", err.message);
    }

    // 3. Test Validation Errors (Short Password)
    console.log("\n3️⃣ Testing Validation Error (Short Password)...");
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...testUser, password: "123", email: "new@example.com" })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (res.status === 400) {
            console.log("✅ Success: Validation error correctly handled with 400");
        } else {
            console.error("❌ Failure: Expected 400 for validation error");
        }
    } catch (err) {
        console.error("❌ Error during validation test:", err.message);
    }
}

runTests();
