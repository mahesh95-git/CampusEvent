import { Router } from "express";
import {
  getStudentEventById,
  getStudentOverview,
  listStudentEvents,
} from "../controllers/studentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

router.use(asyncHandler(requireAuth));
router.use(requireRole("student"));

router.get("/overview", asyncHandler(getStudentOverview));
router.get("/events/:eventId", asyncHandler(getStudentEventById));
router.get("/events", asyncHandler(listStudentEvents));

export default router;
