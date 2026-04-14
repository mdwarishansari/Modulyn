/**
 * server/src/modules/module/core/module.controller.ts
 * Core module controller — handles shared CRUD and lifecycle transitions.
 * Delegates all business logic to module.service.ts
 */

// import { asyncHandler }     from "@utils/asyncHandler";
// import { sendSuccess, sendCreated } from "@utils/response";
// import * as ModuleService   from "./module.service";

// export const listModules = asyncHandler(async (req, res) => {
//   const { eventId } = req.query;
//   const modules = await ModuleService.listModules(eventId as string);
//   sendSuccess(res, modules);
// });

// export const createModule = asyncHandler(async (req, res) => {
//   const module = await ModuleService.createModule(req.body, req.user.id);
//   sendCreated(res, module, "Module created");
// });

// export const getModule = asyncHandler(async (req, res) => {
//   const module = await ModuleService.getModuleById(req.params.id);
//   sendSuccess(res, module);
// });

// export const updateModule = asyncHandler(async (req, res) => {
//   const module = await ModuleService.updateModule(req.params.id, req.body);
//   sendSuccess(res, module, "Module updated");
// });

// export const deleteModule = asyncHandler(async (req, res) => {
//   await ModuleService.deleteModule(req.params.id);
//   sendSuccess(res, null, "Module deleted");
// });

// ─── Lifecycle transitions ────────────────────────────────────────────────────
// export const openRegistration  = asyncHandler(async (req, res) => { ... });
// export const closeRegistration = asyncHandler(async (req, res) => { ... });
// export const goLive            = asyncHandler(async (req, res) => { ... });
// export const finish            = asyncHandler(async (req, res) => { ... });

export {};
