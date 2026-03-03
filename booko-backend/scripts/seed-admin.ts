import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/booko";

// Dynamically import UserModel after dotenv is loaded
async function seedAdmin() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected!");

        const { UserModel } = await import("../src/models/user.model");

        const existing = await UserModel.findOne({ email: "admin@booko.com" });
        if (existing) {
            console.log("Admin user already exists:", existing.email);
            // Update password and role just in case
            existing.passwordHash = await bcrypt.hash("admin123", 10);
            existing.role = "admin";
            await existing.save();
            console.log("Admin password and role refreshed.");
        } else {
            const passwordHash = await bcrypt.hash("admin123", 10);
            await UserModel.create({
                name: "Admin",
                email: "admin@booko.com",
                passwordHash,
                phoneNumber: "9800000000",
                role: "admin",
                gender: "prefer_not_to_say",
            });
            console.log("Admin user created: admin@booko.com / admin123");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
}

seedAdmin();
