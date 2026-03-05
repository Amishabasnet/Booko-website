
const BASE_URL = "http://localhost:5050/api/auth";

async function runRBACTests() {
    console.log("Starting RBAC Middleware Tests...");

    const adminUser = {
        name: "Admin User",
        email: `admin_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "admin"
    };

    const regularUser = {
        name: "Regular User",
        email: `user_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "user"
    };

    // 0. Register and Login
    console.log("\n Pre-registering and logging in users...");
    await fetch(`${BASE_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(adminUser) });
    await fetch(`${BASE_URL}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(regularUser) });

    const adminLogin = await fetch(`${BASE_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: adminUser.email, password: adminUser.password }) }).then(res => res.json());
    const userLogin = await fetch(`${BASE_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: regularUser.email, password: regularUser.password }) }).then(res => res.json());

    const adminToken = adminLogin.token;
    const userToken = userLogin.token;

    // 1. Test Admin Access (Authorized)
    console.log("\n Testing Admin Access to Admin Route...");
    try {
        const res = await fetch(`${BASE_URL}/admin-only`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        const data = await res.json();
        console.log("Status:", res.status);
        if (res.status === 200 && data.success) {
            console.log(" Success: Admin correctly authorized.");
        } else {
            console.error(" Failure: Admin should be authorized.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }

    // 2. Test User Access (Forbidden)
    console.log("\n Testing Regular User Access to Admin Route...");
    try {
        const res = await fetch(`${BASE_URL}/admin-only`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        console.log("Status:", res.status);
        if (res.status === 403) {
            console.log(" Success: Regular user correctly forbidden (403).");
        } else {
            console.error(" Failure: Expected 403 Forbidden for insufficient role.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }

    // 3. Test No Token (Unauthorized)
    console.log("\n Testing Access Without Token...");
    try {
        const res = await fetch(`${BASE_URL}/admin-only`, { method: "GET" });
        console.log("Status:", res.status);
        if (res.status === 401) {
            console.log(" Success: Unauthorized access correctly handled (401).");
        } else {
            console.error(" Failure: Expected 401 Unauthorized for missing token.");
        }
    } catch (err: any) { console.error(" Error:", err.message); }
}

runRBACTests();
