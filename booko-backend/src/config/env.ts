import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!ENV.MONGO_URI) throw new Error("MONGO_URI missing in .env");
if (!ENV.JWT_SECRET) throw new Error("JWT_SECRET missing in .env");