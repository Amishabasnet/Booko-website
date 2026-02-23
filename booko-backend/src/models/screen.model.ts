import mongoose, { Schema, InferSchemaType } from "mongoose";

const ScreenSchema = new Schema(
    {
        theaterId: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
        screenName: { type: String, required: true },
        totalSeats: { type: Number, required: true },
        seatLayout: { type: [[Object]], required: true }, // 2D array of seat objects
    },
    { timestamps: true }
);

export type ScreenDoc = InferSchemaType<typeof ScreenSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const ScreenModel = mongoose.model("Screen", ScreenSchema);
