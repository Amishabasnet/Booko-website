import { body } from "express-validator";

export const createBookingValidation = [
    body("showtimeId").isMongoId().withMessage("Invalid showtime ID"),
    body("selectedSeats")
        .isArray({ min: 1 })
        .withMessage("At least one seat must be selected"),
    body("selectedSeats.*")
        .isString()
        .notEmpty()
        .withMessage("Seat ID must be a string"),
];

export const updateBookingStatusValidation = [
    body("bookingStatus")
        .optional()
        .isIn(["confirmed", "cancelled", "pending"])
        .withMessage("Invalid booking status"),
    body("paymentStatus")
        .optional()
        .isIn(["pending", "completed", "failed", "refunded"])
        .withMessage("Invalid payment status"),
];
