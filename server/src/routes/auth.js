import { Router } from "express";

import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  updateCurrentUser,
} from "../controllers/auth/user.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

router.post("/login", asyncHandler(loginUser));
router.get("/me", asyncHandler(requireAuth), asyncHandler(getCurrentUser));
router.patch("/me", asyncHandler(requireAuth), asyncHandler(updateCurrentUser));
router.patch("/me/password", asyncHandler(requireAuth), asyncHandler(changePassword));
router.post("/logout", asyncHandler(logoutUser));

export default router;
