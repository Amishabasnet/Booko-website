import mongoose, { Schema, InferSchemaType } from "mongoose";

const MovieSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        genre: [{ type: String, required: true }],
        duration: { type: Number, required: true }, // duration in minutes
        language: { type: String, required: true },
        releaseDate: { type: Date, required: true },
        posterImage: { type: String, default: "" },
    },
    { timestamps: true }
);

export type MovieDoc = InferSchemaType<typeof MovieSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const MovieModel = mongoose.model("Movie", MovieSchema);
