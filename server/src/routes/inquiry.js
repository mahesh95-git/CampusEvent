import { Router } from "express";
import { submitInquiry } from "../controllers/inquiryController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(submitInquiry));

export default router;
