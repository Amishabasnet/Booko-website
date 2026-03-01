import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../.env") });

import { TheaterModel } from "../src/models/theater.model";
import { ScreenModel } from "../src/models/screen.model";
import { ShowtimeModel } from "../src/models/showtime.model";
import { MovieModel } from "../src/models/movie.model";

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/booko";

const generateSeatLayout = (rows: number, colsPerRow: number) => {
    const layout = [];
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < rows; r++) {
        const rowData = [];
        const rowLabel = rowLetters[r];
        for (let c = 1; c <= colsPerRow; c++) {
            rowData.push({
                row: rowLabel,
                col: c,
                isAvailable: true,
                type: r > rows - 3 ? "premium" : "normal"
            });
        }
        layout.push(rowData);
    }
    return layout;
};

const seedShowtimes = async () => {
    try {
        console.log("Connecting to MongoDB format:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully!");

        // Clear existing related data to avoid duplicates for testing
        await TheaterModel.deleteMany({});
        await ScreenModel.deleteMany({});
        await ShowtimeModel.deleteMany({});
        console.log("Cleared existing theaters, screens, and showtimes...");

        const movie = await MovieModel.findOne({ title: "Predator: Badlands" });
        if (!movie) {
            console.error("Movie 'Predator: Badlands' not found. Please run seed-movies.ts first.");
            process.exit(1);
        }

        console.log("Creating Theater...");
        const theater = await TheaterModel.create({
            name: "QFX Civil Mall",
            location: "Civil Mall, Sundhara",
            totalScreens: 1
        });

        console.log("Creating Screen...");
        const screen = await ScreenModel.create({
            theaterId: theater._id,
            screenName: "Audi 1",
            totalSeats: 50,
            seatLayout: generateSeatLayout(5, 10)
        });

        console.log("Creating Showtimes...");

        // Today's showtimes
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await ShowtimeModel.insertMany([
            {
                movieId: movie._id,
                theaterId: theater._id,
                screenId: screen._id,
                showDate: today,
                showTime: "14:00",
                ticketPrice: 400
            },
            {
                movieId: movie._id,
                theaterId: theater._id,
                screenId: screen._id,
                showDate: today,
                showTime: "18:30",
                ticketPrice: 500
            },
            {
                movieId: movie._id,
                theaterId: theater._id,
                screenId: screen._id,
                showDate: tomorrow,
                showTime: "10:00",
                ticketPrice: 350
            }
        ]);

        console.log("Successfully seeded showtimes!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding showtimes:", error);
        process.exit(1);
    }
};

seedShowtimes();
