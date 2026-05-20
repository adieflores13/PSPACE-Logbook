import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";

import { prisma } from "../lib/prisma";

const router = Router();

const registerSchema = z
  .object({
    profileImage: z.string().trim().min(1, "Profile image is required"),
    fullName: z.string().trim().min(2, "Full name is required"),
    dateOfBirth: z.coerce.date(),
    email: z.string().trim().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

const loginSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password is required"),
  });

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "dev-only-secret-change-in-production";
}

function signAuthToken(userId: string, email: string): string {
  const payload = {
    sub: userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getJwtSecret()).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(candidate, "hex");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function toPublicUser(user: {
  id: string;
  profileImage: string | null;
  fullName: string;
  dateOfBirth: Date;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    profileImage: user.profileImage,
    fullName: user.fullName,
    dateOfBirth: user.dateOfBirth,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.flatten(),
    });
  }

  const payload = parsed.data;
  const email = payload.email.toLowerCase();
  const rawPassword = payload.password;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = hashPassword(rawPassword);
    const user = await prisma.user.create({
      data: {
        profileImage: payload.profileImage,
        fullName: payload.fullName,
        dateOfBirth: payload.dateOfBirth,
        email,
        passwordHash,
      },
    });

    const token = signAuthToken(user.id, user.email);
    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Could not register user",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.flatten(),
    });
  }

  const payload = parsed.data;
  const email = payload.email.toLowerCase();
  const rawPassword = payload.password;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const matches = verifyPassword(rawPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signAuthToken(user.id, user.email);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Could not login",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
