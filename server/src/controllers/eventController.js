import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import bcrypt from "bcryptjs";

function normalizeEvent(event) {
  return {
    id: event.id,
    eventName: event.eventName,
    description: event.description,
    eventBanner: event.eventBanner,
    bannerUrl: event.bannerUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    registrationDeadline: event.registrationDeadline,
    venue: event.venue,
    eventType: event.eventType,
    registrationType: event.registrationType,
    feeType: event.feeType,
    feeAmount: Number(event.feeAmount),
    maxParticipants: event.maxParticipants,
    status: event.status,
    isCompulsory: event.isCompulsory,
    registrationFormSchema: event.registrationFormSchema,
    registrationFormLink: event.registrationFormLink,
    organizationId: event.organizationId,
    createdBy: event.createdBy,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    departments: event.departments.map((link) => ({
      id: link.department.id,
      name: link.department.DepartmentName,
      shortName: link.department.ShortName,
      color: link.department.colourCode,
    })),
    registrationCount: event._count?.registrations ?? 0,
    creator: event.creator
      ? {
          id: event.creator.id,
          name: event.creator.name,
          email: event.creator.email,
        }
      : null,
  };
}

function buildEventAccessWhere(user) {
  if (user.role === "coordinator") {
    if (!user.departmentId) {
      return {
        organizationId: user.organizationId,
        id: -1,
      };
    }

    return {
      organizationId: user.organizationId,
      departments: {
        some: {
          departmentId: user.departmentId,
        },
      },
    };
  }

  return {
    organizationId: user.organizationId,
  };
}

async function autoRegisterStudentsForCompulsoryEvent(eventId, departmentIds, organizationId) {
  try {
    // Find all students in the specified departments
    const studentsInDepartments = await prisma.user.findMany({
      where: {
        role: "student",
        organizationId: organizationId,
        departmentId: {
          in: departmentIds,
        },
      },
      select: { id: true },
    });

    if (studentsInDepartments.length === 0) {
      return;
    }

    // Auto-register each student for this event
    const registrations = studentsInDepartments.map((student) => ({
      userId: student.id,
      eventId: eventId,
      status: "registered",
      paymentStatus: "completed",
      amountPaid: 0,
      formResponse: {},
      registeredAt: new Date(),
    }));

    await prisma.registration.createMany({
      data: registrations,
      skipDuplicates: true,
    });
  } catch (error) {
    // Log error but don't fail event creation
    console.error("Error auto-registering students for compulsory event:", error);
  }
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
}

function normalizeParticipant(registration) {
  return {
    id: registration.id,
    status: registration.status,
    registeredAt: registration.registeredAt,
    paymentStatus: registration.paymentStatus,
    amountPaid: Number(registration.amountPaid),
    formResponse: registration.formResponse,
    participant: registration.user
      ? {
          id: registration.user.id,
          name: registration.user.name,
          email: registration.user.email,
          contactPhone: registration.user.contactPhone,
          department: registration.user.department
            ? {
                id: registration.user.department.id,
                name: registration.user.department.DepartmentName,
                shortName: registration.user.department.ShortName,
              }
            : null,
        }
      : null,
    event: registration.event
      ? {
          id: registration.event.id,
          eventName: registration.event.eventName,
          registrationType: registration.event.registrationType,
        }
      : null,
  };
}

function normalizeEventDetail(event) {
  const baseEvent = normalizeEvent(event);
  const registrations = event.registrations ?? [];
  const volunteers = Array.isArray(event.registrationFormSchema?.volunteers)
    ? event.registrationFormSchema.volunteers
    : [];

  return {
    ...baseEvent,
    participants: registrations.map(normalizeParticipant),
    volunteers,
    participantCount: registrations.length,
    volunteerCount: volunteers.length,
  };
}

export async function listEvents(req, res) {
  const events = await prisma.event.findMany({
    where: buildEventAccessWhere(req.user),
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
    orderBy: {
      startDate: "desc",
    },
  });

  return successResponse(
    res,
    { events: events.map(normalizeEvent) },
    "Events fetched successfully",
    200,
  );
}

export async function getEventById(req, res) {
  const eventId = Number(req.params.eventId);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  const event = await prisma.event.findFirst({
    where: {
      ...buildEventAccessWhere(req.user),
      id: eventId,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      registrations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactPhone: true,
              department: {
                select: {
                  id: true,
                  DepartmentName: true,
                  ShortName: true,
                },
              },
            },
          },
          event: {
            select: {
              id: true,
              eventName: true,
              registrationType: true,
            },
          },
        },
        orderBy: {
          registeredAt: "desc",
        },
      },
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  return successResponse(
    res,
    { event: normalizeEventDetail(event) },
    "Event details fetched successfully",
    200,
  );
}

export async function getCoordinatorOverview(req, res) {
  const events = await prisma.event.findMany({
    where: buildEventAccessWhere(req.user),
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });

  const totalRegistrations = events.reduce(
    (sum, event) => sum + (event._count?.registrations ?? 0),
    0,
  );

  const monthlyMap = new Map();
  const now = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = getMonthKey(date);
    monthlyMap.set(key, {
      month: getMonthLabel(key),
      events: 0,
    });
  }

  events.forEach((event) => {
    const key = getMonthKey(new Date(event.startDate));
    if (monthlyMap.has(key)) {
      monthlyMap.get(key).events += 1;
    }
  });

  return successResponse(
    res,
    {
      overview: {
        coordinator: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          department: req.user.department
            ? {
                id: req.user.department.id,
                name: req.user.department.DepartmentName,
                shortName: req.user.department.ShortName,
              }
            : null,
          organization: req.user.organization
            ? {
                id: req.user.organization.id,
                name: req.user.organization.collegeName,
                slug: req.user.organization.collegeSlug,
              }
            : null,
        },
        stats: {
          totalEvents: events.length,
          activeEvents: events.filter((event) => event.status === "active").length,
          totalRegistrations,
        },
        monthlyEvents: Array.from(monthlyMap.values()),
        recentEvents: events.slice(0, 5).map((event) => ({
          id: event.id,
          name: event.eventName,
          date: event.startDate,
          status: event.status,
          registrations: event._count?.registrations ?? 0,
        })),
      },
    },
    "Coordinator overview fetched successfully",
    200,
  );
}

export async function listParticipants(req, res) {
  const registrations = await prisma.registration.findMany({
    where: {
      event: buildEventAccessWhere(req.user),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          contactPhone: true,
          department: {
            select: {
              id: true,
              DepartmentName: true,
              ShortName: true,
            },
          },
        },
      },
      event: {
        select: {
          id: true,
          eventName: true,
          registrationType: true,
        },
      },
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return successResponse(
    res,
    {
      participants: registrations.map(normalizeParticipant),
    },
    "Participants fetched successfully",
    200,
  );
}

export async function createEvent(req, res) {
  const {
    eventName,
    description,
    eventBanner,
    bannerUrl,
    startDate,
    endDate,
    registrationDeadline,
    venue,
    eventType,
    registrationType,
    feeType,
    feeAmount,
    maxParticipants,
    status,
    departmentIds,
    registrationFormSchema,
    isCompulsory,
  } = req.body;

  if (
    !eventName?.trim() ||
    !startDate ||
    !endDate ||
    !registrationDeadline ||
    !venue?.trim() ||
    !eventType?.trim() ||
    !registrationType?.trim() ||
    !feeType?.trim() ||
    !status?.trim() ||
    !Array.isArray(departmentIds) ||
    departmentIds.length === 0
  ) {
    throw new AppError("Please fill all required event fields.", 400);
  }

  const uniqueDepartmentIds = [...new Set(departmentIds.map((id) => Number(id)).filter(Boolean))];

  if (uniqueDepartmentIds.length === 0) {
    throw new AppError("At least one department is required.", 400);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const deadline = new Date(registrationDeadline);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    Number.isNaN(deadline.getTime())
  ) {
    throw new AppError("Invalid event dates provided.", 400);
  }

  if (end < start) {
    throw new AppError("Event end date must be after the start date.", 400);
  }

  if (deadline > start) {
    throw new AppError("Registration deadline must be before the event start date.", 400);
  }

  const departments = await prisma.department.findMany({
    where: {
      id: { in: uniqueDepartmentIds },
      organizationId: req.user.organizationId,
    },
    select: { id: true },
  });

  if (departments.length !== uniqueDepartmentIds.length) {
    throw new AppError("One or more selected departments are invalid for this college.", 400);
  }

  const normalizedFeeAmount =
    feeType.trim().toLowerCase() === "free" ? 0 : Number(feeAmount ?? 0);
  const normalizedEventType = eventType.trim().toLowerCase();
  const allowedEventTypes = ["internal", "public"];

  if (!allowedEventTypes.includes(normalizedEventType)) {
    throw new AppError("Event type must be internal or public.", 400);
  }

  if (Number.isNaN(normalizedFeeAmount) || normalizedFeeAmount < 0) {
    throw new AppError("Fee amount must be a valid positive number.", 400);
  }

  const normalizedRegistrationSchema =
    registrationFormSchema && typeof registrationFormSchema === "object"
      ? {
          ...registrationFormSchema,
          audience: normalizedEventType,
        }
      : null;

  // Generate unique registration form link
  const registrationFormLink = `${crypto.randomUUID().substring(0, 12)}`;

  const createdEvent = await prisma.event.create({
    data: {
      eventName: eventName.trim(),
      description: description?.trim() || null,
      eventBanner: eventBanner?.trim() || null,
      bannerUrl: bannerUrl?.trim() || null,
      startDate: start,
      endDate: end,
      registrationDeadline: deadline,
      venue: venue.trim(),
      eventType: normalizedEventType,
      registrationType: registrationType.trim().toLowerCase(),
      feeType: feeType.trim().toLowerCase(),
      feeAmount: normalizedFeeAmount,
      maxParticipants: maxParticipants ? Number(maxParticipants) : null,
      status: status.trim().toLowerCase(),
      isCompulsory: isCompulsory && normalizedEventType === "internal" ? Boolean(isCompulsory) : false,
      organizationId: req.user.organizationId,
      createdBy: req.user.id,
      registrationFormSchema: normalizedRegistrationSchema,
      registrationFormLink: registrationFormLink,
      departments: {
        create: uniqueDepartmentIds.map((departmentId) => ({
          department: {
            connect: { id: departmentId },
          },
        })),
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
  });

  // Auto-register students if event is marked as compulsory
  if (createdEvent.isCompulsory) {
    await autoRegisterStudentsForCompulsoryEvent(
      createdEvent.id,
      uniqueDepartmentIds,
      req.user.organizationId
    );
  }

  // Assign volunteers (existing students) to tasks
  const volunteers = Array.isArray(registrationFormSchema?.volunteers)
    ? registrationFormSchema.volunteers
    : [];

  for (const vData of volunteers) {
    if (!vData.email || !vData.taskTitle) continue;

    const normalizedEmail = vData.email.trim().toLowerCase();

    // Look up existing student by email within the same organization
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, organizationId: true },
    });

    if (!existingUser || existingUser.organizationId !== req.user.organizationId) {
      // Skip if student not found in this organization
      continue;
    }

    // Assign the task to the existing student
    await prisma.task.create({
      data: {
        eventId: createdEvent.id,
        assignedTo: existingUser.id,
        title: vData.taskTitle.trim(),
        description: vData.taskDescription?.trim() || null,
        priority: vData.priority || "medium",
        status: "pending",
        dueDate: start,
      },
    });
  }

  return successResponse(
    res,
    { event: normalizeEvent(createdEvent) },
    "Event created successfully",
    201,
  );
}

export async function updateEventStatus(req, res) {
  const eventId = Number(req.params.eventId);
  const { status } = req.body;
  const allowedStatuses = ["draft", "upcoming", "active", "completed"];
  const normalizedStatus = status?.trim().toLowerCase();

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  if (!normalizedStatus || !allowedStatuses.includes(normalizedStatus)) {
    throw new AppError("A valid event status is required.", 400);
  }

  const existingEvent = await prisma.event.findFirst({
    where: {
      ...buildEventAccessWhere(req.user),
      id: eventId,
    },
    select: { id: true, status: true },
  });

  if (!existingEvent) {
    throw new AppError("Event not found.", 404);
  }

  const transitionMap = {
    collegeadmin: {
      draft: ["upcoming", "active", "completed"],
      upcoming: ["draft", "active", "completed"],
      active: ["upcoming", "completed"],
      completed: [],
    },
    coordinator: {
      draft: ["upcoming"],
      upcoming: ["active"],
      active: ["completed"],
      completed: [],
    },
  };

  const currentStatus = existingEvent.status?.toLowerCase() || "draft";
  const allowedNextStatuses =
    transitionMap[req.user.role]?.[currentStatus] ?? [];

  if (currentStatus === normalizedStatus) {
    throw new AppError("Event is already in the selected status.", 400);
  }

  if (!allowedNextStatuses.includes(normalizedStatus)) {
    throw new AppError(
      "You are not allowed to move this event to the selected status.",
      403,
    );
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      status: normalizedStatus,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
  });

  return successResponse(
    res,
    { event: normalizeEvent(updatedEvent) },
    "Event status updated successfully",
    200,
  );
}

export async function registerForEvent(req, res) {
  const eventId = Number(req.params.eventId);
  const { formResponse } = req.body;
  const userId = req.user.id;

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  if (!formResponse || typeof formResponse !== "object") {
    throw new AppError("Form response is required.", 400);
  }

  // Get event with form schema to validate fields
  const event = await prisma.event.findFirst({
    where: { id: eventId },
    select: {
      id: true,
      eventType: true,
      registrationDeadline: true,
      maxParticipants: true,
      registrationFormSchema: true,
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // Check if registration deadline has passed
  if (new Date() > new Date(event.registrationDeadline)) {
    throw new AppError("Registration deadline has passed.", 400);
  }

  // Check if max participants reached
  if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
    throw new AppError("Event has reached maximum participants.", 400);
  }

  // Check if already registered
  const existingRegistration = await prisma.registration.findFirst({
    where: {
      eventId,
      userId,
    },
  });

  if (existingRegistration) {
    throw new AppError("You are already registered for this event.", 400);
  }

  // Validate required fields from schema
  if (event.registrationFormSchema?.fields && Array.isArray(event.registrationFormSchema.fields)) {
    const requiredFields = event.registrationFormSchema.fields.filter((field) => field.required);
    for (const field of requiredFields) {
      if (!formResponse[field.label] || (typeof formResponse[field.label] === "string" && !formResponse[field.label].trim())) {
        throw new AppError(`Field "${field.label}" is required.`, 400);
      }
    }
  }

  // Create registration
  const registration = await prisma.registration.create({
    data: {
      eventId,
      userId,
      status: "confirmed",
      formResponse,
      paymentStatus: event.feeType === "free" ? "completed" : "pending",
      amountPaid: event.feeAmount || 0,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          contactPhone: true,
          department: {
            select: {
              id: true,
              DepartmentName: true,
              ShortName: true,
            },
          },
        },
      },
      event: {
        select: {
          id: true,
          eventName: true,
          registrationType: true,
        },
      },
    },
  });

  return successResponse(
    res,
    {
      registration: {
        id: registration.id,
        status: registration.status,
        registeredAt: registration.registeredAt,
        paymentStatus: registration.paymentStatus,
        amountPaid: Number(registration.amountPaid),
        formResponse: registration.formResponse,
        participant: registration.user,
        event: registration.event,
      },
    },
    "Successfully registered for event",
    201,
  );
}

export async function getEventByFormLink(req, res) {
  const { formLink } = req.params;

  if (!formLink?.trim()) {
    throw new AppError("Registration form link is required.", 400);
  }

  const event = await prisma.event.findFirst({
    where: {
      registrationFormLink: formLink.trim(),
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // Check if registration deadline has passed
  const now = new Date();
  const deadline = new Date(event.registrationDeadline);

  if (now > deadline) {
    throw new AppError("The registration deadline for this event has passed.", 410);
  }

  // Check if max participants reached
  if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
    throw new AppError("This event has reached its maximum participant limit.", 409);
  }

  return successResponse(
    res,
    {
      event: {
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        bannerUrl: event.bannerUrl,
        startDate: event.startDate,
        endDate: event.endDate,
        registrationDeadline: event.registrationDeadline,
        venue: event.venue,
        eventType: event.eventType,
        registrationType: event.registrationType,
        feeType: event.feeType,
        feeAmount: Number(event.feeAmount),
        maxParticipants: event.maxParticipants,
        status: event.status,
        isCompulsory: event.isCompulsory,
        registrationFormSchema: event.registrationFormSchema,
        participantCount: event._count.registrations,
      },
    },
    "Event found",
    200,
  );
}

export async function registerForEventPublic(req, res) {
  const { formLink } = req.params;
  const { email, name, formResponse } = req.body;

  if (!formLink?.trim()) {
    throw new AppError("Registration form link is required.", 400);
  }

  if (!email?.trim() || !email.includes("@")) {
    throw new AppError("Valid email is required.", 400);
  }

  if (!name?.trim()) {
    throw new AppError("Name is required.", 400);
  }

  if (!formResponse || typeof formResponse !== "object") {
    throw new AppError("Form response is required.", 400);
  }

  // Find event by form link
  const event = await prisma.event.findFirst({
    where: {
      registrationFormLink: formLink.trim(),
    },
    select: {
      id: true,
      eventType: true,
      eventName: true,
      feeType: true,
      feeAmount: true,
      registrationDeadline: true,
      maxParticipants: true,
      registrationFormSchema: true,
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // Check registration deadline
  if (new Date() > new Date(event.registrationDeadline)) {
    throw new AppError("The registration deadline for this event has passed.", 410);
  }

  // Validate form fields
  const requiredFields = event.registrationFormSchema?.fields?.filter((f) => f.required) || [];
  for (const field of requiredFields) {
    if (!formResponse[field.label]?.trim?.()) {
      throw new AppError(`Field "${field.label}" is required.`, 400);
    }
  }

  //Check max participants
  if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
    throw new AppError("This event has reached its maximum participant limit.", 409);
  }

  // Filter formResponse to only include fields defined in schema
  const filteredFormResponse = {};
  if (event.registrationFormSchema?.fields && Array.isArray(event.registrationFormSchema.fields)) {
    event.registrationFormSchema.fields.forEach((field) => {
      if (formResponse[field.label] !== undefined) {
        filteredFormResponse[field.label] = formResponse[field.label];
      }
    });
  }

  // Create registration for guest (no user association)
  // All data stored in formResponse - no separate columns needed
  const registration = await prisma.registration.create({
    data: {
      eventId: event.id,
      status: "confirmed",
      formResponse: filteredFormResponse,
      paymentStatus: event.feeType === "free" ? "completed" : "pending",
      amountPaid: event.feeAmount || 0,
    },
  });

  return successResponse(
    res,
    {
      registration: {
        id: registration.id,
        status: registration.status,
        registeredAt: registration.registeredAt,
        paymentStatus: registration.paymentStatus,
        message: "Registration successful! Check your email for confirmation details.",
      },
    },
    "Successfully registered for event",
    201,
  );
}
