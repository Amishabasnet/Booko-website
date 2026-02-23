import { body } from "express-validator";

export const theaterValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),
    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),
    body("totalScreens")
        .isInt({ min: 1 })
        .withMessage("Total screens must be at least 1"),
];
