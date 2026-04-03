import { Router } from "express";

import {
  createDepartment,
  listCoordinators,
  listDepartments,
  listStudents,
} from "../controllers/departmentController.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

router.use(asyncHandler(requireAuth));

router.get("/", requireRole("collegeadmin", "coordinator"), asyncHandler(listDepartments));
router.get("/students", requireRole("collegeadmin", "coordinator"), asyncHandler(listStudents));
router.get("/coordinators", requireRole("collegeadmin"), asyncHandler(listCoordinators));
router.post("/", requireRole("collegeadmin"), asyncHandler(createDepartment));

export default router;
