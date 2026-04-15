import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

function normalizeDepartment(department) {
  const coordinator = department.users.find((user) => user.role === "coordinator") ?? null;
  const studentCount = department.users.filter((user) => user.role === "student").length;

  return {
    id: department.id,
    name: department.DepartmentName,
    shortName: department.ShortName,
    color: department.colourCode,
    organizationId: department.organizationId,
    coordinator: coordinator
      ? {
          id: coordinator.id,
          name: coordinator.name,
          email: coordinator.email,
          contactPhone: coordinator.contactPhone,
        }
      : null,
    studentCount,
    userCount: department.users.length,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };
}

function normalizeCoordinator(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    contactPhone: user.contactPhone,
    status: user.departmentId ? "active" : "pending",
    assignedDate: user.createdAt,
    department: user.department
      ? {
          id: user.department.id,
          name: user.department.DepartmentName,
          shortName: user.department.ShortName,
        }
      : null,
    eventsManaged: user.createdEvents.length,
  };
}

function normalizeStudent(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    contactPhone: user.contactPhone,
    isApproved: user.isApproved,
    createdAt: user.createdAt,
    department: user.department
      ? {
          id: user.department.id,
          name: user.department.DepartmentName,
          shortName: user.department.ShortName,
        }
      : null,
  };
}

async function transferCreatedEvents(tx, sourceUserIds, targetUserId) {
  if (!sourceUserIds.length) {
    return;
  }

  await tx.event.updateMany({
    where: {
      createdBy: {
        in: sourceUserIds,
      },
    },
    data: {
      createdBy: targetUserId,
    },
  });
}

export async function listDepartments(req, res) {
  const departments = await prisma.department.findMany({
    where: {
      organizationId: req.user.organizationId,
      ...(req.user.role === "coordinator" && req.user.departmentId
        ? { id: req.user.departmentId }
        : {}),
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          contactPhone: true,
          role: true,
        },
      },
    },
    orderBy: {
      DepartmentName: "asc",
    },
  });

  return successResponse(
    res,
    {
      departments: departments.map(normalizeDepartment),
    },
    "Departments fetched successfully",
    200,
  );
}

export async function createDepartment(req, res) {
  const {
    name,
    shortName,
    color,
    coordinatorName,
    coordinatorEmail,
    coordinatorPhone,
    coordinatorPassword,
  } = req.body;

  if (!name?.trim() || !shortName?.trim() || !color?.trim()) {
    throw new AppError("Department name, short name, and color are required.", 400);
  }

  const trimmedName = name.trim();
  const trimmedShortName = shortName.trim();
  const trimmedColor = color.trim();
  const trimmedCoordinatorName = coordinatorName?.trim() || "";
  const trimmedCoordinatorEmail = coordinatorEmail?.trim().toLowerCase() || "";
  const trimmedCoordinatorPhone = coordinatorPhone?.trim() || "";
  const trimmedCoordinatorPassword = coordinatorPassword?.trim() || "";

  const hasCoordinatorInput =
    trimmedCoordinatorName ||
    trimmedCoordinatorEmail ||
    trimmedCoordinatorPhone ||
    trimmedCoordinatorPassword;

  if (
    hasCoordinatorInput &&
    (!trimmedCoordinatorName ||
      !trimmedCoordinatorEmail ||
      !trimmedCoordinatorPhone ||
      !trimmedCoordinatorPassword)
  ) {
    throw new AppError(
      "To create a coordinator, name, email, phone, and password are all required.",
      400,
    );
  }

  const existingDepartment = await prisma.department.findFirst({
    where: {
      organizationId: req.user.organizationId,
      OR: [
        { DepartmentName: { equals: trimmedName, mode: "insensitive" } },
        { ShortName: { equals: trimmedShortName, mode: "insensitive" } },
      ],
    },
    select: { id: true },
  });

  if (existingDepartment) {
    throw new AppError("A department with this name or short name already exists.", 409);
  }

  if (hasCoordinatorInput) {
    const existingCoordinator = await prisma.user.findUnique({
      where: { email: trimmedCoordinatorEmail },
      select: { id: true },
    });

    if (existingCoordinator) {
      throw new AppError("Coordinator email already exists.", 409);
    }
  }

  const department = await prisma.$transaction(async (tx) => {
    const createdDepartment = await tx.department.create({
      data: {
        DepartmentName: trimmedName,
        ShortName: trimmedShortName,
        colourCode: trimmedColor,
        organizationId: req.user.organizationId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            contactPhone: true,
            role: true,
          },
        },
      },
    });

    if (!hasCoordinatorInput) {
      return createdDepartment;
    }

    const passwordHash = await bcrypt.hash(trimmedCoordinatorPassword, 10);

    await tx.user.create({
      data: {
        name: trimmedCoordinatorName,
        email: trimmedCoordinatorEmail,
        contactPhone: trimmedCoordinatorPhone,
        password: passwordHash,
        role: "coordinator",
        organizationId: req.user.organizationId,
        departmentId: createdDepartment.id,
        collegeSlug: req.user.organization?.collegeSlug ?? req.user.collegeSlug,
      },
    });

    return tx.department.findUnique({
      where: { id: createdDepartment.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            contactPhone: true,
            role: true,
          },
        },
      },
    });
  });

  return successResponse(
    res,
    {
      department: normalizeDepartment(department),
    },
    "Department created successfully",
    201,
  );
}

export async function deleteDepartment(req, res) {
  const departmentId = Number(req.params.id);

  if (!departmentId) {
    throw new AppError("Department id is required.", 400);
  }

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      organizationId: req.user.organizationId,
    },
    include: {
      users: {
        select: {
          id: true,
          role: true,
          createdEvents: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!department) {
    throw new AppError("Department not found.", 404);
  }

  const coordinatorIds = department.users
    .filter((user) => user.role === "coordinator")
    .map((user) => user.id);
  const sourceUserIds = department.users
    .filter((user) => user.createdEvents.length > 0)
    .map((user) => user.id);

  await prisma.$transaction(async (tx) => {
    await tx.user.updateMany({
      where: {
        departmentId: department.id,
      },
      data: {
        departmentId: null,
      },
    });

    await transferCreatedEvents(tx, sourceUserIds, req.user.id);

    if (coordinatorIds.length > 0) {
      await tx.user.deleteMany({
        where: {
          id: {
            in: coordinatorIds,
          },
        },
      });
    }

    await tx.department.delete({
      where: {
        id: department.id,
      },
    });
  });

  return successResponse(res, {}, "Department deleted successfully", 200);
}

export async function listCoordinators(req, res) {
  const coordinators = await prisma.user.findMany({
    where: {
      organizationId: req.user.organizationId,
      role: "coordinator",
    },
    include: {
      department: {
        select: {
          id: true,
          DepartmentName: true,
          ShortName: true,
        },
      },
      createdEvents: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return successResponse(
    res,
    {
      coordinators: coordinators.map(normalizeCoordinator),
    },
    "Coordinators fetched successfully",
    200,
  );
}

export async function deleteCoordinator(req, res) {
  const coordinatorId = Number(req.params.id);

  if (!coordinatorId) {
    throw new AppError("Coordinator id is required.", 400);
  }

  const coordinator = await prisma.user.findFirst({
    where: {
      id: coordinatorId,
      organizationId: req.user.organizationId,
      role: "coordinator",
    },
    include: {
      createdEvents: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!coordinator) {
    throw new AppError("Coordinator not found.", 404);
  }

  await prisma.$transaction(async (tx) => {
    await transferCreatedEvents(tx, coordinator.createdEvents.length > 0 ? [coordinator.id] : [], req.user.id);

    await tx.user.delete({
      where: {
        id: coordinator.id,
      },
    });
  });

  return successResponse(res, {}, "Coordinator deleted successfully", 200);
}

export async function listStudents(req, res) {
  const students = await prisma.user.findMany({
    where: {
      organizationId: req.user.organizationId,
      role: "student",
      ...(req.user.role === "coordinator" && req.user.departmentId
        ? { departmentId: req.user.departmentId }
        : {}),
    },
    include: {
      department: {
        select: {
          id: true,
          DepartmentName: true,
          ShortName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return successResponse(
    res,
    {
      students: students.map(normalizeStudent),
    },
    "Students fetched successfully",
    200,
  );
}

export async function approveStudent(req, res) {
  const studentId = Number(req.params.id);

  if (!studentId) {
    throw new AppError("Student id is required.", 400);
  }

  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
      organizationId: req.user.organizationId,
      role: "student",
      ...(req.user.role === "coordinator" && req.user.departmentId
        ? { departmentId: req.user.departmentId }
        : {}),
    },
    include: {
      department: {
        select: {
          id: true,
          DepartmentName: true,
          ShortName: true,
        },
      },
    },
  });

  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  const updatedStudent = await prisma.user.update({
    where: {
      id: student.id,
    },
    data: {
      isApproved: true,
    },
    include: {
      department: {
        select: {
          id: true,
          DepartmentName: true,
          ShortName: true,
        },
      },
    },
  });

  return successResponse(
    res,
    {
      student: normalizeStudent(updatedStudent),
    },
    "Student approved successfully",
    200,
  );
}
