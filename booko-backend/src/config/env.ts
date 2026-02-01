import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 10,
};

if (!env.MONGO_URI) throw new Error("Missing MONGO_URI in .env");
if (!env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");
