import { Router } from "express";

import { registerOrganization } from "../controllers/organizationController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(registerOrganization));

export default router;
