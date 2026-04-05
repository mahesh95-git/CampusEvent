import { Router } from "express";

import {
  createEvent,
  getEventById,
  getCoordinatorOverview,
  listEvents,
  listParticipants,
  updateEventStatus,
  registerForEvent,
  getEventByFormLink,
  registerForEventPublic,
} from "../controllers/eventController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

// Public routes - no auth needed
router.get("/form/:formLink", asyncHandler(getEventByFormLink));
router.post("/form/:formLink/register", asyncHandler(registerForEventPublic));

router.use(asyncHandler(requireAuth));

// Student registration route (must be before roleCheck middleware)
router.post(
  "/:eventId/register",
  requireRole("student"),
  asyncHandler(registerForEvent),
);

// Student view event details route
router.get(
  "/:eventId",
  requireRole("student"),
  asyncHandler(getEventById),
);

// All other routes require admin or coordinator role
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
