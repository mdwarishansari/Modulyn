/**
 * server/src/config/env.ts
 * Fail-fast environment variable validation.
 */

import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Prefer .env.local for local development testing overrides
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log(`[Config] Initialized using .env.local`);
} else {
  dotenv.config({ path: envPath });
  console.log(`[Config] Initialized using .env`);
}

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV: optional("NODE_ENV", "development"),
  PORT: parseInt(optional("PORT", "5000"), 10),

  // Database
  DATABASE_URL: required("DATABASE_URL"),

  // Clerk
  CLERK_SECRET_KEY: required("CLERK_SECRET_KEY"),
  CLERK_WEBHOOK_SECRET: optional("CLERK_WEBHOOK_SECRET", ""),

  // Super Admin
  SUPER_ADMIN_EMAIL: optional("SUPER_ADMIN_EMAIL", ""),
  SUPER_ADMIN_ALLOWED_DOMAINS: optional("SUPER_ADMIN_ALLOWED_DOMAINS", ""),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),

  // Email
  EMAIL_PROVIDER: optional("EMAIL_PROVIDER", "resend"),
  RESEND_API_KEY: optional("RESEND_API_KEY", ""),

  SMTP_HOST: optional("SMTP_HOST", ""),
  SMTP_PORT: parseInt(optional("SMTP_PORT", "587"), 10),
  SMTP_USER: optional("SMTP_USER", ""),
  SMTP_PASS: optional("SMTP_PASS", ""),

  // Config
  APP_URL: optional("APP_URL", "http://localhost:5000"),
  CLIENT_URL: optional("CLIENT_URL", "http://localhost:3000"),

  // Security
  RATE_LIMIT_WINDOW_MS: parseInt(optional("RATE_LIMIT_WINDOW_MS", "900000"), 10),
  RATE_LIMIT_MAX: parseInt(optional("RATE_LIMIT_MAX", "100"), 10),

  get isDevelopment(): boolean {
    return this.NODE_ENV === "development";
  },
  get isProduction(): boolean {
    return this.NODE_ENV === "production";
  },
} as const;
