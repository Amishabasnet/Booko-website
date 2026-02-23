import axios from "axios";

const BASE_URL = "http://127.0.0.1:5050/api/bookings";
const SHOWTIME_URL = "http://127.0.0.1:5050/api/showtimes";
const MOVIE_URL = "http://127.0.0.1:5050/api/movies";
const THEATER_URL = "http://127.0.0.1:5050/api/theaters";
const SCREEN_URL = "http://127.0.0.1:5050/api/screens";
const AUTH_URL = "http://127.0.0.1:5050/api/auth";

async function runBookingTests() {
    console.log("🚀 Starting Booking API Tests...");

    const adminUser = {
        name: "Booking Admin",
        email: `booking_admin_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "admin"
    };

    const regularUser1 = {
        name: "Booking User 1",
        email: `book_user1_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "user"
    };

    const regularUser2 = {
        name: "Booking User 2",
        email: `book_user2_${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "user"
    };

    try {
        // 0. Setup
        console.log("\n0️⃣ Setting up environment...");
        await axios.post(`${AUTH_URL}/register`, adminUser);
        await axios.post(`${AUTH_URL}/register`, regularUser1);
        await axios.post(`${AUTH_URL}/register`, regularUser2);

        const adminToken = await axios.post(`${AUTH_URL}/login`, { email: adminUser.email, password: adminUser.password }).then(r => r.data.token);
        const user1Token = await axios.post(`${AUTH_URL}/login`, { email: regularUser1.email, password: regularUser1.password }).then(r => r.data.token);
        const user2Token = await axios.post(`${AUTH_URL}/login`, { email: regularUser2.email, password: regularUser2.password }).then(r => r.data.token);

        const authAdmin = { headers: { "Authorization": `Bearer ${adminToken}` } };
        const authUser1 = { headers: { "Authorization": `Bearer ${user1Token}` } };
        const authUser2 = { headers: { "Authorization": `Bearer ${user2Token}` } };

        const movieRes = await axios.post(`${MOVIE_URL}/`, {
            title: "Booking Movie", description: "Test", genre: ["Test"], duration: 100, language: "English", releaseDate: new Date()
        }, authAdmin);
        const movieId = movieRes.data.movie._id;

        const theaterRes = await axios.post(`${THEATER_URL}/`, {
            name: "Booking Theater", location: "Test", totalScreens: 1
        }, authAdmin);
        const theaterId = theaterRes.data.theater._id;

        const screenRes = await axios.post(`${SCREEN_URL}/`, {
            theaterId, screenName: "Screen 1", totalSeats: 10,
            seatLayout: [[{ row: "A", col: 1 }, { row: "A", col: 2 }]]
        }, authAdmin);
        const screenId = screenRes.data.screen._id;

        const showtimeRes = await axios.post(`${SHOWTIME_URL}/`, {
            movieId, theaterId, screenId, showDate: new Date(), showTime: "20:00", ticketPrice: 50
        }, authAdmin);
        const showtimeId = showtimeRes.data.showtime._id;

        let bookingID: string = "";

        // 1. Successful Booking
        console.log("\n1️⃣ Testing Successful Booking (User 1)...");
        const book1Res = await axios.post(`${BASE_URL}/`, {
            showtimeId, selectedSeats: ["A-1"]
        }, authUser1);
        console.log("Status:", book1Res.status);
        if (book1Res.status === 201 && book1Res.data.success) {
            console.log("✅ Success: Booking created.");
            console.log("Total Amount:", book1Res.data.booking.totalAmount); // Should be 50
            bookingID = book1Res.data.booking._id;
        }

        // 2. Double Booking Prevention
        console.log("\n2️⃣ Testing Double Booking Prevention (User 2 trying the same seat)...");
        try {
            await axios.post(`${BASE_URL}/`, {
                showtimeId, selectedSeats: ["A-1"]
            }, authUser2);
            console.error("❌ Failure: User 2 managed to book already taken seat!");
        } catch (err: any) {
            console.log("Status:", err.response?.status);
            if (err.response?.status === 400) {
                console.log("✅ Success: Prevented double booking.");
            } else {
                console.error("❌ Failure: Expected 400, got", err.response?.status);
            }
        }

        // 3. User Bookings
        console.log("\n3️⃣ Testing Get User Bookings...");
        const userBooksRes = await axios.get(`${BASE_URL}/user`, authUser1);
        console.log("Status:", userBooksRes.status);
        if (userBooksRes.data.bookings.length > 0) {
            console.log("✅ Success: User history retrieved.");
        }

        // 4. Admin All Bookings
        console.log("\n4️⃣ Testing Admin Get All Bookings...");
        const adminBooksRes = await axios.get(`${BASE_URL}/`, authAdmin);
        console.log("Status:", adminBooksRes.status);
        if (adminBooksRes.data.bookings.length >= 1) {
            console.log("✅ Success: Admin view works.");
        }

        // 5. Update Status (Cancel)
        console.log("\n5️⃣ Testing Booking Cancellation...");
        const cancelRes = await axios.put(`${BASE_URL}/${bookingID}/status`, {
            bookingStatus: "cancelled"
        }, authUser1);
        console.log("Status:", cancelRes.status);
        if (cancelRes.data.booking.bookingStatus === "cancelled") {
            console.log("✅ Success: Booking cancelled.");
        }

        // 6. Verify Seats Freed
        console.log("\n6️⃣ Verifying Seats Freed After Cancellation...");
        const book2Res = await axios.post(`${BASE_URL}/`, {
            showtimeId, selectedSeats: ["A-1"]
        }, authUser2);
        if (book2Res.status === 201) {
            console.log("✅ Success: User 2 now books the previously cancelled seat.");
        }

    } catch (err: any) {
        console.error("❌ Error:", err.response?.data || err.message);
    }
}

runBookingTests();
