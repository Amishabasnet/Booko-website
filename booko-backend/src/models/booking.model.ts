import mongoose, { Schema, InferSchemaType } from "mongoose";

const BookingSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        showtimeId: { type: Schema.Types.ObjectId, ref: "Showtime", required: true },
        selectedSeats: { type: [String], required: true },
        totalAmount: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        bookingStatus: {
            type: String,
            enum: ["confirmed", "cancelled", "pending"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export type BookingDoc = InferSchemaType<typeof BookingSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const BookingModel = mongoose.model("Booking", BookingSchema);
