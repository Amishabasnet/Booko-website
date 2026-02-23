import mongoose, { Schema, InferSchemaType } from "mongoose";

const PaymentSchema = new Schema(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, required: true }, // e.g., 'credit_card', 'paypal', 'stripe'
        transactionId: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export type PaymentDoc = InferSchemaType<typeof PaymentSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const PaymentModel = mongoose.model("Payment", PaymentSchema);
