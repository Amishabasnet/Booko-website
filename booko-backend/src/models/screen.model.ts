import mongoose, { Schema, InferSchemaType } from "mongoose";

const SeatSchema = new Schema({
    row: { type: String, required: true },
    col: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    type: { type: String, enum: ["normal", "premium", "vip"], default: "normal" }
}, { _id: false });

const ScreenSchema = new Schema(
    {
        theaterId: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
        screenName: { type: String, required: true, trim: true },
        totalSeats: { type: Number, required: true },
        seatLayout: [[SeatSchema]],
    },
    { timestamps: true }
);

export type ScreenDoc = InferSchemaType<typeof ScreenSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const ScreenModel = mongoose.model("Screen", ScreenSchema);
