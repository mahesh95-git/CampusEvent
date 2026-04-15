import { Router } from "express";

import {
  createDepartment,
  deleteCoordinator,
  deleteDepartment,
  approveStudent,
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
router.patch("/students/:id/approve", requireRole("collegeadmin", "coordinator"), asyncHandler(approveStudent));
router.get("/coordinators", requireRole("collegeadmin"), asyncHandler(listCoordinators));
router.post("/", requireRole("collegeadmin"), asyncHandler(createDepartment));
router.delete("/coordinators/:id", requireRole("collegeadmin"), asyncHandler(deleteCoordinator));
router.delete("/:id", requireRole("collegeadmin"), asyncHandler(deleteDepartment));

export default router;
