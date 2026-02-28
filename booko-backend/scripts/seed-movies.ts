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
    },
    {
        title: "Kabaddi 5",
        posterImage: "/assets/images/kabaddi5.jpg",
        language: "Nepali",
        duration: 110,
        description: "A heartfelt Nepali story about relationships, struggle and growth.",
        genre: ["Drama", "Comedy", "Romance"],
        releaseDate: new Date(),
    },
    {
        title: "Man Binako Dhan",
        posterImage: "/assets/images/manbinakodhan.jpg",
        language: "Nepali",
        duration: 125,
        description: "A heartfelt Nepali story about relationships, struggle and growth.",
        genre: ["Drama", "Family"],
        releaseDate: new Date(),
    },
    {
        title: "The Running Man",
        posterImage: "/assets/images/runningman.jpg",
        language: "English",
        duration: 120,
        description: "A high-stakes action movie where survival becomes entertainment.",
        genre: ["Action", "Sci-Fi", "Thriller"],
        releaseDate: new Date(),
    },
    {
        title: "Wicked: For Good",
        posterImage: "/assets/images/wicked.jpg",
        language: "English",
        duration: 115,
        description: "A musical fantasy journey exploring friendship, destiny and magic.",
        genre: ["Fantasy", "Musical", "Adventure"],
        releaseDate: new Date(),
    },
    {
        title: "Avengers: Secret Wars",
        posterImage: "/assets/images/avengers.jpg",
        language: "English",
        duration: 150,
        description: "Marvel heroes unite in a multiverse-level war with massive consequences.",
        genre: ["Action", "Sci-Fi", "Adventure"],
        releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Coming soon
    },
    {
        title: "Joker: Folie à Deux",
        posterImage: "/assets/images/joker.jpg",
        language: "English",
        duration: 125,
        description: "A dark psychological story continuing Joker’s chaotic path.",
        genre: ["Crime", "Drama", "Thriller"],
        releaseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Coming soon
    },
    {
        title: "Dune Messiah",
        posterImage: "/assets/images/dune3.jpeg",
        language: "English",
        duration: 155,
        description: "Epic sci-fi saga continues with power, prophecy, and war on Arrakis.",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        releaseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Coming soon
    }
];

const seedMovies = async () => {
    try {
        console.log("Connecting to MongoDB format:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);

        console.log("Connected to MongoDB successfully!");

        // Optional: Clear existing movies before inserting
        // await MovieModel.deleteMany({});
        // console.log("Cleared existing movies...");

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
