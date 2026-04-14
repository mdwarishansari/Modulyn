/**
 * server/src/modules/auth/auth.routes.ts
 * Auth module route definitions.
 * Handlers will be implemented in auth.controller.ts
 */

import { Router } from "express";
// import { login, register, refreshToken, logout } from "./auth.controller";
// import { validate } from "@middlewares/validate";
// import { loginSchema, registerSchema } from "./auth.schema";

const router = Router();

// POST /api/v1/auth/register
// router.post("/register", validate(registerSchema), register);

// POST /api/v1/auth/login
// router.post("/login", validate(loginSchema), login);

// POST /api/v1/auth/refresh
// router.post("/refresh", refreshToken);

// POST /api/v1/auth/logout
// router.post("/logout", logout);

export default router;
