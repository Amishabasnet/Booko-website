import { body } from "express-validator";

export const screenValidation = [
    body("theaterId")
        .isMongoId()
        .withMessage("Invalid theater ID"),
    body("screenName")
        .trim()
        .notEmpty()
        .withMessage("Screen name is required"),
    body("totalSeats")
        .isInt({ min: 1 })
        .withMessage("Total seats must be at least 1"),
    body("seatLayout")
        .isArray({ min: 1 })
        .withMessage("Seat layout must be a 2D array of seats"),
    body("seatLayout.*")
        .isArray()
        .withMessage("Each row in seat layout must be an array"),
    body("seatLayout.*.*.row")
        .notEmpty()
        .withMessage("Seat row identifier is required"),
    body("seatLayout.*.*.col")
        .isInt({ min: 1 })
        .withMessage("Seat column identifier must be a number"),
    body("seatLayout.*.*.type")
        .optional()
        .isIn(["normal", "premium", "vip"])
        .withMessage("Invalid seat type"),
];
