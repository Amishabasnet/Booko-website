import mongoose, { Schema, InferSchemaType } from "mongoose";

const ShowtimeSchema = new Schema(
    {
        movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
        theaterId: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
        screenId: { type: String, required: true }, // Can be Screen ObjectId or a custom label like "AUD1"
        showDate: { type: Date, required: true },
        showTime: { type: String, required: true }, // Format HH:mm
        ticketPrice: { type: Number, required: true },
        bookedSeats: { type: [String], default: [] }, // Array of seat IDs (e.g. "A-1", "B-5")
    },
    { timestamps: true }
);

export type ShowtimeDoc = InferSchemaType<typeof ShowtimeSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const ShowtimeModel = mongoose.model("Showtime", ShowtimeSchema);
