import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/booko";

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected");

        const { BookingModel } = await import("../src/models/booking.model");
        const { UserModel } = await import("../src/models/user.model");

        const bookings = await BookingModel.find().populate("userId");
        console.log(`Found ${bookings.length} bookings`);

        let updated = 0;
        for (const b of bookings) {
            const obj: any = b.toObject();
            const need = !obj.customerName || !obj.customerEmail;
            if (need) {
                let name = "";
                let email = "";
                if (obj.userId && typeof obj.userId === "object") {
                    name = obj.userId.name || "";
                    email = obj.userId.email || "";
                } else if (obj.userId) {
                    // fallback: look up user by id
                    const u = await UserModel.findById(obj.userId);
                    if (u) {
                        name = u.name || "";
                        email = u.email || "";
                    }
                }
                await BookingModel.updateOne(
                    { _id: obj._id },
                    { $set: { customerName: name, customerEmail: email } }
                );
                updated++;
            }
        }
        console.log(`Updated ${updated} bookings with customer snapshot`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed", err);
        process.exit(1);
    }
}

migrate();
