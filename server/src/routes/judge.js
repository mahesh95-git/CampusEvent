import { Router } from "express";

import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";
import {
  createJudgeResultFile,
  getJudgeDashboard,
  getJudgeEventById,
  listJudgeEvents,
  upsertJudgeScore,
} from "../controllers/judgeController.js";

const router = Router();

router.use(asyncHandler(requireAuth));
router.use(requireRole("judge"));

router.get("/dashboard", asyncHandler(getJudgeDashboard));
router.get("/events", asyncHandler(listJudgeEvents));
router.get("/events/:eventId", asyncHandler(getJudgeEventById));
router.post("/events/:eventId/scores", asyncHandler(upsertJudgeScore));
router.post("/events/:eventId/results", asyncHandler(createJudgeResultFile));

export default router;
