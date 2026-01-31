import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 3000;

export const MONGODB_URI: string = process.env.MONGODB_URI || "mongodb+srv://amishaaaaaa045_db_user:C8fiE2ewZp4WQ9iP@cluster0.5mzey5h.mongodb.net";

export const JWT_SECRET: string = process.env.JWT_SECRET || 'default'