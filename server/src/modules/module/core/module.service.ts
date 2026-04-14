/**
 * server/src/modules/module/core/module.service.ts
 * Core module service — shared business logic for all module types.
 *
 * Module-type-specific logic (e.g. quiz question handling) lives in:
 *   types/quiz/quiz.service.ts
 *   types/hackathon/hackathon.service.ts
 *   etc.
 *
 * This service handles:
 *   - Common CRUD (create, read, update, delete)
 *   - Lifecycle state machine enforcement
 *   - Validation that only allowed state transitions occur
 */

// import prisma                         from "@lib/prisma";
// import { AppError }                   from "@middlewares/errorHandler";
// import { MODULE_STATE_TRANSITIONS }   from "../../../../shared/constants";

// export async function listModules(eventId: string) {
//   return prisma.module.findMany({ where: { eventId }, orderBy: { orderIndex: "asc" } });
// }

// export async function getModuleById(id: string) {
//   const module = await prisma.module.findUnique({ where: { id } });
//   if (!module) throw new AppError("Module not found", 404);
//   return module;
// }

// export async function createModule(data: CreateModuleInput, createdById: string) {
//   return prisma.module.create({ data: { ...data, createdById } });
// }

// export async function updateModule(id: string, data: UpdateModuleInput) {
//   return prisma.module.update({ where: { id }, data });
// }

// export async function deleteModule(id: string) {
//   return prisma.module.delete({ where: { id } });
// }

// export async function transitionState(id: string, targetState: string) {
//   const module = await getModuleById(id);
//   const allowed = MODULE_STATE_TRANSITIONS[module.state] ?? [];
//   if (!allowed.includes(targetState)) {
//     throw new AppError(
//       `Cannot transition from ${module.state} to ${targetState}`,
//       400
//     );
//   }
//   return prisma.module.update({ where: { id }, data: { state: targetState } });
// }

export {};
