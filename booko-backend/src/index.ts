import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./database/db";
import { ENV } from "./config/env";

import authRoutes from "./routes/auth.route";
import movieRoutes from "./routes/movie.route";
import theaterRoutes from "./routes/theater.route";
import adminUserRoutes from "./routes/admin/admin.users.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: ENV.CLIENT_ORIGIN,
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use("/api/auth", authRoutes);
  app.use("/api/movies", movieRoutes);
  app.use("/api/theaters", theaterRoutes);
  app.use("/api/admin/users", adminUserRoutes);

  app.use(errorMiddleware);

  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`✅ Server running on http://localhost:${ENV.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Server failed to start:", err);
  process.exit(1);
});