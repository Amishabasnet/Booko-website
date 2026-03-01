import { body } from "express-validator";

export const movieValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1 })
        .withMessage("Title cannot be empty"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),
    body("genre")
        .isArray({ min: 1 })
        .withMessage("At least one genre is required"),
    body("genre.*")
        .trim()
        .notEmpty()
        .withMessage("Genre item cannot be empty"),
    body("duration")
        .isNumeric()
        .withMessage("Duration must be a number (minutes)"),
    body("language")
        .trim()
        .notEmpty()
        .withMessage("Language is required"),
    body("releaseDate")
        .isISO8601()
        .withMessage("Release date must be a valid ISO8601 date"),
    body("posterImage")
        .optional()
];
