import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./database/db";
import { ENV } from "./config/env";

import authRoutes from "./routes/auth.route";
import movieRoutes from "./routes/movie.route";
import theaterRoutes from "./routes/theater.route";
import screenRoutes from "./routes/screen.route";
import showtimeRoutes from "./routes/showtime.route";
import bookingRoutes from "./routes/booking.route";
import paymentRoutes from "./routes/payment.route";
import adminUserRoutes from "./routes/admin/admin.users.routes";
import adminDashboardRoutes from "./routes/admin/admin.dashboard.route";

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
  app.use("/api/screens", screenRoutes);
  app.use("/api/showtimes", showtimeRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/admin/users", adminUserRoutes);
  app.use("/api/admin/dashboard", adminDashboardRoutes);

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