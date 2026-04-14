/**
 * client/config/index.ts
 * App-wide configuration constants.
 * All values sourced from environment variables via NEXT_PUBLIC_ prefix.
 */

export const config = {
  app: {
    name: "Modulyn",
    description: "A multi-tenant modular event operating platform",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    version: "1.0.0",
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
    timeout: 15_000, // ms
  },

  auth: {
    accessTokenKey: "modulyn_access_token",
    refreshTokenKey: "modulyn_refresh_token",
  },

  pagination: {
    defaultLimit: 12,
  },
} as const;
