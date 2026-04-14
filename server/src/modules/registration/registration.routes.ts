/**
 * server/src/modules/registration/registration.routes.ts
 */
import { Router } from "express";
const router = Router();

// POST   /api/v1/registrations             → register for a module
// GET    /api/v1/registrations?moduleId=.. → list registrations (admin)
// GET    /api/v1/registrations/me          → current user's registrations
// DELETE /api/v1/registrations/:id         → cancel registration

export default router;
