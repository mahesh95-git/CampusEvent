import { Router } from "express";

import {
  createEvent,
  getEventById,
  getCoordinatorOverview,
  listEvents,
  listParticipants,
  updateEventStatus,
} from "../controllers/eventController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

router.use(asyncHandler(requireAuth));
router.use(requireRole("collegeadmin", "coordinator"));

router.get("/coordinator/overview", asyncHandler(getCoordinatorOverview));
router.get("/participants", asyncHandler(listParticipants));
router.get("/:eventId", asyncHandler(getEventById));
router.get("/", asyncHandler(listEvents));
router.post("/", asyncHandler(createEvent));
router.patch(
  "/:eventId/status",
  requireRole("collegeadmin", "coordinator"),
  asyncHandler(updateEventStatus),
);

export default router;
