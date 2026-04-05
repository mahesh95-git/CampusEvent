import { Router } from "express";
import {
  getVolunteerDashboard,
  getAssignEvents,
  getAssignedTasks,
  updateTaskStatus,
  getEventParticipants,
  markAttendance,
  assignVolunteer,
  getEventVolunteers,
} from "../controllers/volunteerController.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = Router();

// Any authenticated user can access volunteer routes (tasks are assigned to existing students)
router.use(requireAuth);

router.get("/dashboard", asyncHandler(getVolunteerDashboard));
router.get("/events", asyncHandler(getAssignEvents));
router.get("/tasks", asyncHandler(getAssignedTasks));
router.patch("/tasks/:taskId", asyncHandler(updateTaskStatus));
router.get("/events/:eventId/participants", asyncHandler(getEventParticipants));
router.patch("/registrations/:registrationId/attendance", asyncHandler(markAttendance));

// Coordinator routes - require coordinator or admin role
router.use(requireRole("coordinator", "collegeadmin"));
router.post("/assign", asyncHandler(assignVolunteer));
router.get("/events/:eventId/volunteers", asyncHandler(getEventVolunteers));

export default router;
