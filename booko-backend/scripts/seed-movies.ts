import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../.env") });

import { MovieModel } from "../src/models/movie.model";

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/booko";

const movies = [
    {
        title: "Predator: Badlands",
        posterImage: "/assets/images/predator-badlands.jpg",
        language: "English",
        duration: 105,
        description: "A new Predator story set in harsh Badlands. Action, survival, and intense hunting.",
        genre: ["Action", "Sci-Fi", "Thriller"],
        releaseDate: new Date(),
    }
];

const seedMovies = async () => {
    try {
        console.log("Connecting to MongoDB format:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);

        console.log("Connected to MongoDB successfully!");

        // Clear existing movies before inserting
        await MovieModel.deleteMany({});
        console.log("Cleared existing movies...");

        console.log("Inserting new movies...");
        await MovieModel.insertMany(movies);
        console.log("Successfully seeded movies!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding movies:", error);
        process.exit(1);
    }
};

seedMovies();
