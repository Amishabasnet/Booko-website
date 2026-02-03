import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDB } from "./database/mongodb";
import { authRouter } from "./routes/auth.route";
import { errorHandler } from "./middlewares/errorHandler";

async function bootstrap() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true, service: "booko-backend" }));

  app.use("/api/auth", authRouter);

  app.use(errorHandler);

  app.listen(env.PORT, () => console.log(`🚀 Server running on :${env.PORT}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
