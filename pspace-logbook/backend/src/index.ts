import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.get("/", (_req, res) => {
  res.json({ service: "pspace-logbook-backend", status: "running" });
});

app.use("/api/auth", authRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server running on http://localhost:${port}`);
});
