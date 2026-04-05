import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import requireAuth from "../middlewares/requireAuth.js";
import {
  uploadCollegeLogo,
  uploadEventBanner,
  uploadProfilePicture,
} from "../controllers/uploadController.js";

const router = express.Router();

// Accept any file field for flexibility (client might send "file", "logo", "banner", etc)
router.post(
  "/college-logo",
  requireAuth,
  upload.any(),
  asyncHandler(uploadCollegeLogo)
);

router.post(
  "/event-banner",
  requireAuth,
  upload.any(),
  asyncHandler(uploadEventBanner)
);

router.post(
  "/profile-picture",
  requireAuth,
  upload.any(),
  asyncHandler(uploadProfilePicture)
);

export default router;
