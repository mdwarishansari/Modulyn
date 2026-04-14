/**
 * server/src/modules/auth/auth.controller.ts
 * Auth controller — request/response handling only.
 * Delegates all business logic to auth.service.ts
 */

// import { Request, Response } from "express";
// import { asyncHandler } from "@utils/asyncHandler";
// import { sendSuccess, sendCreated } from "@utils/response";
// import * as AuthService from "./auth.service";

// export const register = asyncHandler(async (req, res) => {
//   const user = await AuthService.registerUser(req.body);
//   sendCreated(res, user, "Account created successfully");
// });

// export const login = asyncHandler(async (req, res) => {
//   const tokens = await AuthService.loginUser(req.body);
//   sendSuccess(res, tokens, "Login successful");
// });

export {};
