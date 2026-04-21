import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { successResponse } from "../../utils/apiResponse.js";
import { attachAuthCookie, clearAuthCookie } from "../../utils/authCookie.js";

const ROLE_ALIASES = {
  orgadmin: "collegeadmin",
  collegeadmin: "collegeadmin",
  coordinator: "coordinator",
  judge: "judge",
  collegestudent: "student",
  student: "student",
  volunteer: "volunteer",
};

function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    contactPhone: user.contactPhone,
    profilePictureUrl: user.profilePictureUrl || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    collegeSlug: user.organization?.collegeSlug ?? user.collegeSlug,
    organization: user.organization,
    department: user.department,
  };
}
function normalizeRole(role) {
  if (!role) {
    return null;
  }

  return ROLE_ALIASES[String(role).trim().toLowerCase()] ?? null;
}

export async function loginUser(req, res) {
  const { email, password, role, collegeSlug } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRole = normalizeRole(role);
  const normalizedCollegeSlug = collegeSlug?.trim().toLowerCase() || null;

  if (role && !normalizedRole) {
    throw new AppError(
      "Invalid role. Use collegeAdmin, coordinator, judge, Student, or volunteer.",
      400,
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      organization: {
        select: {
          id: true,
          collegeName: true,
          collegeSlug: true,
          logoUrl: true,
        },
      },
      department: {
        select: {
          id: true,
          DepartmentName: true,
          ShortName: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials.", 401);
  }

  if (normalizedRole && user.role !== normalizedRole) {
    throw new AppError(
      "This account does not have access for the selected role.",
      403,
    );
  }

  if (
    normalizedCollegeSlug &&
    user.organization?.collegeSlug !== normalizedCollegeSlug &&
    user.collegeSlug !== normalizedCollegeSlug
  ) {
    throw new AppError(
      "This account does not belong to the selected college.",
      403,
    );
  }

  if (user.role === "student" && !user.isApproved) {
    throw new AppError(
      "Your account is pending coordinator approval. Please wait before logging in.",
      403,
    );
  }

  const responseUser = buildUserResponse(user);
  attachAuthCookie(res, {
    userId: user.id,
    role: user.role,
    collegeSlug: responseUser.collegeSlug,
  });

  return successResponse(
    res,
    {
      user: responseUser,
    },
    "Login successful",
    200,
  );
}

export async function getCurrentUser(req, res) {
  return successResponse(
    res,
    {
      user: buildUserResponse(req.user),
    },
    "Authenticated user fetched successfully",
    200,
  );
}

export async function updateCurrentUser(req, res) {
  const { name, email, contactPhone } = req.body;

  if (!name?.trim() || !email?.trim() || !contactPhone?.trim()) {
    throw new AppError("Name, email, and phone are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      NOT: {
        id: req.user.id,
      },
    },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("Email is already in use.", 409);
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: name.trim(),
      email: normalizedEmail,
      contactPhone: contactPhone.trim(),

    },
    include: {
      organization: {
        select: {
          id: true,
          collegeName: true,
          collegeSlug: true,
          logoUrl: true,
        },
      },
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
    { user: buildUserResponse(user) },
    "Profile updated successfully",
    200,
  );
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError("All password fields are required.", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("New password and confirmation do not match.", 400);
  }

  if (newPassword.length < 8) {
    throw new AppError("New password must be at least 8 characters long.", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      password: true,
    },
  });

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect.", 400);
  }

  const password = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password },
  });

  return successResponse(res, {}, "Password updated successfully", 200);
}

export async function logoutUser(req, res) {
  clearAuthCookie(res);
  return successResponse(res, {}, "Logout successful", 200);
}
