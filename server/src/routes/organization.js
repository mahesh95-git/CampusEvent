import { Router } from "express";

import {
  getOrganizationBySlug,
  getMyOrganization,
  getOrganizationOverview,
  registerStudentForOrganization,
  registerOrganization,
  updateMyOrganization,
} from "../controllers/organizationController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

router.post("/", asyncHandler(registerOrganization));
router.post("/:slug/students", asyncHandler(registerStudentForOrganization));
router.get(
  "/me/overview",
  asyncHandler(requireAuth),
  requireRole("collegeadmin"),
  asyncHandler(getOrganizationOverview),
);
router.get(
  "/me",
  asyncHandler(requireAuth),
  requireRole("collegeadmin"),
  asyncHandler(getMyOrganization),
);
router.patch(
  "/me",
  asyncHandler(requireAuth),
  requireRole("collegeadmin"),
  asyncHandler(updateMyOrganization),
);
router.get("/:slug", asyncHandler(getOrganizationBySlug));

export default router;
