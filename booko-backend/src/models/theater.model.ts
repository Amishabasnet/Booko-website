import mongoose, { Schema, InferSchemaType } from "mongoose";

const TheaterSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        location: { type: String, required: true },
        // totalScreens: { type: Number, required: true },
        totalScreens: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
);

export type TheaterDoc = InferSchemaType<typeof TheaterSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const TheaterModel = mongoose.model("Theater", TheaterSchema);
