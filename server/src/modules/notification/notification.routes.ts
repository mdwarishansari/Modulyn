/**
 * server/src/modules/notification/notification.routes.ts
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import { asyncHandler } from "@utils/asyncHandler";
import { notificationService } from "./notification.service";

const router = Router();

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user!.id);
  res.json({ success: true, data: notifications });
}));

router.patch("/read-all", requireAuth, asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user!.id);
  res.json({ success: true, message: "All notifications marked as read" });
}));

router.patch("/:id/read", requireAuth, asyncHandler(async (req, res) => {
  try {
    const notif = await notificationService.markRead(req.params.id as string, req.user!.id);
    res.json({ success: true, data: notif });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ACCESS") {
      res.status(403).json({ success: false, message: "Not your notification" });
      return;
    }
    throw err;
  }
}));

export default router;
