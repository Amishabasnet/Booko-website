import { body } from "express-validator";

export const showtimeValidation = [
    body("movieId").isMongoId().withMessage("Invalid movie ID"),
    body("theaterId").isMongoId().withMessage("Invalid theater ID"),
    body("screenId").isMongoId().withMessage("Invalid screen ID"),
    body("showDate").isISO8601().withMessage("Show date must be a valid ISO8601 date"),
    body("showTime")
        .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .withMessage("Show time must be in HH:mm format"),
    body("ticketPrice").isNumeric().withMessage("Ticket price must be a number").isFloat({ min: 0 }).withMessage("Ticket price cannot be negative"),
    body("bookedSeats").optional().isArray().withMessage("Booked seats must be an array of strings"),
];
