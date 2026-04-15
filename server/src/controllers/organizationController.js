import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

function buildCollegeProfile(organization) {
  return {
    id: organization.id,
    name: organization.collegeName,
    slug: organization.collegeSlug,
    type: organization.collegeType,
    establishedYear: organization.establishedYear,
    affiliatedUniversity: organization.affiliatedUniversity,
    website: organization.website,
    logoUrl: organization.logoUrl,
    location: `${organization.addressCity}, ${organization.addressState}`,
    address: {
      street: organization.addressStreet,
      city: organization.addressCity,
      state: organization.addressState,
      pincode: organization.addressPincode,
    },
    initials: organization.collegeName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join(""),
    accentColor: "#0D948B",
    departments: (organization.departments ?? []).map((department) => ({
      id: department.id,
      name: department.DepartmentName,
      shortName: department.ShortName,
      color: department.colourCode,
    })),
  };
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
}

function buildOverviewMetrics({ organization, events, departments, coordinators }) {
  const totalRegistrations = events.reduce(
    (sum, event) => sum + (event._count?.registrations ?? 0),
    0,
  );

  const monthlyMap = new Map();
  const now = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthKey = getMonthKey(date);
    monthlyMap.set(monthKey, {
      month: getMonthLabel(monthKey),
      events: 0,
      registrations: 0,
    });
  }

  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const monthKey = getMonthKey(eventDate);

    if (!monthlyMap.has(monthKey)) {
      return;
    }

    const current = monthlyMap.get(monthKey);
    current.events += 1;
    current.registrations += event._count?.registrations ?? 0;
  });

  const departmentPerformance = departments.map((department) => {
    const departmentEvents = events.filter((event) =>
      event.departments.some((link) => link.departmentId === department.id),
    );

    return {
      id: department.id,
      dept: department.ShortName,
      name: department.DepartmentName,
      coordinator: department.users.find((user) => user.role === "coordinator")?.name ?? null,
      events: departmentEvents.length,
      registrations: departmentEvents.reduce(
        (sum, event) => sum + (event._count?.registrations ?? 0),
        0,
      ),
      color: department.colourCode,
    };
  });

  return {
    organization: buildCollegeProfile(organization),
    admin: {
      name: organization.users[0]?.name ?? "Admin",
      email: organization.users[0]?.email ?? "",
    },
    stats: {
      totalEvents: events.length,
      activeEvents: events.filter((event) => event.status === "active").length,
      upcomingEvents: events.filter((event) => event.status === "upcoming").length,
      completedEvents: events.filter((event) => event.status === "completed").length,
      coordinators: coordinators.length,
      departments: departments.length,
      registrations: totalRegistrations,
    },
    monthlyEvents: Array.from(monthlyMap.values()),
    departmentPerformance,
    recentEvents: events
      .slice()
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, 5)
      .map((event) => ({
        id: event.id,
        name: event.eventName,
        date: event.startDate,
        status: event.status,
        reg: event._count?.registrations ?? 0,
        departments: event.departments.map((link) => ({
          id: link.department.id,
          name: link.department.DepartmentName,
          shortName: link.department.ShortName,
          color: link.department.colourCode,
        })),
      })),
    departments: departmentPerformance
      .slice()
      .sort((left, right) => right.events - left.events)
      .slice(0, 6),
  };
}

export async function registerOrganization(req, res) {
  const {
    collegeName,
    collegeSlug,
    collegeType,
    establishedYear,
    affiliatedUniversity,
    website,
    address,
    adminName,
    adminEmail,
    contactPhone,
    adminPassword,
  } = req.body;

  if (
    !collegeName ||
    !collegeSlug ||
    !collegeType ||
    !establishedYear ||
    !affiliatedUniversity ||
    !adminName ||
    !adminEmail ||
    !contactPhone ||
    !adminPassword ||
    !address?.street ||
    !address?.city ||
    !address?.pincode ||
    !address?.state
  ) {
    throw new AppError("Please fill all required fields.", 400);
  }

  const normalizedCollegeSlug = collegeSlug.trim().toLowerCase();
  const normalizedAdminEmail = adminEmail.trim().toLowerCase();
  const normalizedWebsite = website?.trim() || null;

  const [existingOrganization, existingUser] = await Promise.all([
    prisma.organization.findUnique({
      where: { collegeSlug: normalizedCollegeSlug },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { email: normalizedAdminEmail },
      select: { id: true },
    }),
  ]);

  if (existingOrganization || existingUser) {
    throw new AppError("College slug or admin email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        collegeName: collegeName.trim(),
        collegeSlug: normalizedCollegeSlug,
        collegeType,
        establishedYear: Number(establishedYear),
        affiliatedUniversity: affiliatedUniversity.trim(),
        website: normalizedWebsite,
        logoUrl: null,
        addressStreet: address.street.trim(),
        addressCity: address.city.trim(),
        addressPincode: address.pincode.trim(),
        addressState: address.state.trim(),
      },
      select: { id: true, collegeSlug: true },
    });

    await tx.user.create({
      data: {
        name: adminName.trim(),
        email: normalizedAdminEmail,
        contactPhone: contactPhone.trim(),
        password: passwordHash,
        role: "collegeadmin",
        organizationId: organization.id,
        collegeSlug: organization.collegeSlug,
      },
    });
  });

  return successResponse(
    res,
    { collegeSlug: normalizedCollegeSlug },
    "Organization created successfully",
    201,
  );
}

export async function getOrganizationBySlug(req, res) {
  const slug = req.params.slug?.trim().toLowerCase();

  if (!slug) {
    throw new AppError("College slug is required.", 400);
  }

  const organization = await prisma.organization.findUnique({
    where: { collegeSlug: slug },
    select: {
      id: true,
      collegeName: true,
      collegeSlug: true,
      collegeType: true,
      establishedYear: true,
      affiliatedUniversity: true,
      website: true,
      logoUrl: true,
      addressStreet: true,
      addressCity: true,
      addressState: true,
      addressPincode: true,
      departments: {
        select: {
          id: true,
          DepartmentName: true,
          ShortName: true,
          colourCode: true,
        },
        orderBy: {
          DepartmentName: "asc",
        },
      },
    },
  });

  if (!organization) {
    throw new AppError("College not found.", 404);
  }

  return successResponse(
    res,
    { college: buildCollegeProfile(organization) },
    "College fetched successfully",
    200,
  );
}

export async function registerStudentForOrganization(req, res) {
  const slug = req.params.slug?.trim().toLowerCase();
  const {
    fullName,
    email,
    phone,
    departmentId,
    year,
    rollNumber,
    password,
  } = req.body;

  if (
    !slug ||
    !fullName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !departmentId ||
    !year?.trim() ||
    !password?.trim()
  ) {
    throw new AppError("Please fill all required fields.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const organization = await prisma.organization.findUnique({
    where: { collegeSlug: slug },
    select: {
      id: true,
      collegeSlug: true,
    },
  });

  if (!organization) {
    throw new AppError("College not found.", 404);
  }

  const department = await prisma.department.findFirst({
    where: {
      id: Number(departmentId),
      organizationId: organization.id,
    },
    select: {
      id: true,
    },
  });

  if (!department) {
    throw new AppError("Selected department does not belong to this college.", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(password.trim(), 10);

  const student = await prisma.user.create({
      data: {
        name: fullName.trim(),
        email: normalizedEmail,
        contactPhone: phone.trim(),
        password: passwordHash,
        role: "student",
        isApproved: false,
        yearOfStudy: year.trim(),
        rollNumber: rollNumber?.trim() || null,
        organizationId: organization.id,
        departmentId: department.id,
      collegeSlug: organization.collegeSlug,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      collegeSlug: true,
    },
  });

  return successResponse(
    res,
    {
      student,
    },
    "Student account created successfully",
    201,
  );
}

export async function getOrganizationOverview(req, res) {
  const organizationId = req.user.organizationId;

  const [organization, departments, events, coordinators] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          where: { role: "collegeadmin" },
          select: {
            id: true,
            name: true,
            email: true,
          },
          take: 1,
        },
      },
    }),
    prisma.department.findMany({
      where: { organizationId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        DepartmentName: "asc",
      },
    }),
    prisma.event.findMany({
      where: { organizationId },
      include: {
        departments: {
          include: {
            department: {
              select: {
                id: true,
                DepartmentName: true,
                ShortName: true,
                colourCode: true,
              },
            },
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        organizationId,
        role: "coordinator",
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!organization) {
    throw new AppError("College not found.", 404);
  }

  return successResponse(
    res,
    { overview: buildOverviewMetrics({ organization, events, departments, coordinators }) },
    "College overview fetched successfully",
    200,
  );
}

export async function getMyOrganization(req, res) {
  const organization = await prisma.organization.findUnique({
    where: { id: req.user.organizationId },
    select: {
      id: true,
      collegeName: true,
      collegeSlug: true,
      collegeType: true,
      establishedYear: true,
      affiliatedUniversity: true,
      website: true,
      logoUrl: true,
      addressStreet: true,
      addressCity: true,
      addressState: true,
      addressPincode: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!organization) {
    throw new AppError("College not found.", 404);
  }

  return successResponse(
    res,
    {
      organization: {
        ...buildCollegeProfile(organization),
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      },
    },
    "College details fetched successfully",
    200,
  );
}

export async function updateMyOrganization(req, res) {
  const {
    collegeName,
    collegeType,
    establishedYear,
    affiliatedUniversity,
    website,
    logoUrl,
    address,
  } = req.body;

  if (
    !collegeName?.trim() ||
    !collegeType?.trim() ||
    !establishedYear ||
    !affiliatedUniversity?.trim() ||
    !address?.street?.trim() ||
    !address?.city?.trim() ||
    !address?.state?.trim() ||
    !address?.pincode?.trim()
  ) {
    throw new AppError("Please fill all required college fields.", 400);
  }

  const organization = await prisma.organization.update({
    where: { id: req.user.organizationId },
    data: {
      collegeName: collegeName.trim(),
      collegeType: collegeType.trim(),
      establishedYear: Number(establishedYear),
      affiliatedUniversity: affiliatedUniversity.trim(),
      website: website?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      addressStreet: address.street.trim(),
      addressCity: address.city.trim(),
      addressState: address.state.trim(),
      addressPincode: address.pincode.trim(),
    },
    select: {
      id: true,
      collegeName: true,
      collegeSlug: true,
      collegeType: true,
      establishedYear: true,
      affiliatedUniversity: true,
      website: true,
      logoUrl: true,
      addressStreet: true,
      addressCity: true,
      addressState: true,
      addressPincode: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return successResponse(
    res,
    {
      organization: {
        ...buildCollegeProfile(organization),
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      },
    },
    "College details updated successfully",
    200,
  );
}
