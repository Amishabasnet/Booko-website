import axios from "axios";

// stub test to satisfy jest when this file isn't migrated yet
describe('placeholder', () => {
  it('does nothing', () => { expect(true).toBe(true); });
});

const BASE_URL = "http://127.0.0.1:5050/api/screens";
const THEATER_URL = "http://127.0.0.1:5050/api/theaters";
const AUTH_URL = "http://127.0.0.1:5050/api/auth";

async function runScreenTests() {
    console.log("Starting Screen API Tests with Axios...");

    const adminUser = {
        name: "Screen Admin Axios",
        email: `screen_admin_ax_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "admin"
    };

    try {
        // 0. Setup Admin and Theater
        console.log("\n Setting up admin and theater...");
        await axios.post(`${AUTH_URL}/register`, adminUser);
        const loginRes = await axios.post(`${AUTH_URL}/login`, { email: adminUser.email, password: adminUser.password });
        const adminToken = loginRes.data.token;

        const theaterRes = await axios.post(`${THEATER_URL}/`, {
            name: "Screen Test Theater", location: "Test City", totalScreens: 5
        }, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        const theaterId = theaterRes.data.theater._id;

        let screenID: string = "";

        // 1. POST / (Admin)
        console.log("\n Testing Create Screen (Admin Only)...");
        const screenData = {
            theaterId,
            screenName: "Screen 1",
            totalSeats: 50,
            seatLayout: [
                [{ row: "A", col: 1, type: "normal" }, { row: "A", col: 2, type: "normal" }],
                [{ row: "B", col: 1, type: "premium" }, { row: "B", col: 2, type: "premium" }]
            ]
        };

        const createRes = await axios.post(`${BASE_URL}/`, screenData, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        console.log("Status:", createRes.status);
        if (createRes.status === 201 && createRes.data.success) {
            console.log(" Success: Screen created.");
            screenID = createRes.data.screen._id;
        }

        // 2. GET /:theaterId (Public)
        console.log("\n Testing Get Screens by Theater (Public)...");
        const getRes = await axios.get(`${BASE_URL}/${theaterId}`);
        console.log("Status:", getRes.status);
        if (getRes.status === 200 && getRes.data.success && Array.isArray(getRes.data.screens)) {
            console.log("Success: Screens retrieved publically.");
        }

        // 3. PUT /:id (Admin)
        console.log("\n Testing Update Screen (Admin Only)...");
        const updateRes = await axios.put(`${BASE_URL}/${screenID}`, { ...screenData, screenName: "Screen 1 Updated" }, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        console.log("Status:", updateRes.status);
        if (updateRes.status === 200 && updateRes.data.success && updateRes.data.screen.screenName === "Screen 1 Updated") {
            console.log(" Success: Screen updated.");
        }

        // 4. DELETE /:id (Admin)
        console.log("\n Testing Delete Screen (Admin Only)...");
        const deleteRes = await axios.delete(`${BASE_URL}/${screenID}`, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        console.log("Status:", deleteRes.status);
        if (deleteRes.status === 200) {
            console.log(" Success: Screen deleted.");
        }

    } catch (err: any) {
        console.error(" Error:", err.response?.data || err.message);
    }
}

// migrated to jest elsewhere; no invocation here
