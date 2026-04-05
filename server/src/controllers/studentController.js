import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

function formatEventSummary(event) {
  return {
    id: event.id,
    organizationId: event.organizationId,
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
    departments: (event.departments ?? []).map((link) => ({
      id: link.department.id,
      name: link.department.DepartmentName,
      shortName: link.department.ShortName,
      color: link.department.colourCode,
    })),
    registrationCount: event._count?.registrations ?? 0,
    isRegistered: Boolean(
      event.registrations?.some((registration) => registration.userId === event._viewerId),
    ),
  };
}

function buildStudentEventWhere(user) {
  const baseVisibility = [{ eventType: "public" }];

  if (user.organizationId) {
    baseVisibility.push({
      organizationId: user.organizationId,
      OR: [
        { departments: { none: {} } },
        user.departmentId
          ? {
              departments: {
                some: {
                  departmentId: user.departmentId,
                },
              },
            }
          : { organizationId: user.organizationId },
      ],
    });
  }

  return {
    status: {
      in: ["upcoming", "active", "completed"],
    },
    OR: baseVisibility,
  };
}

export async function getStudentOverview(req, res) {
  const [events, registrations] = await Promise.all([
    prisma.event.findMany({
      where: buildStudentEventWhere(req.user),
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
        registrations: {
          where: { userId: req.user.id },
          select: { id: true, userId: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 10,
    }),
    prisma.registration.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          select: {
            id: true,
            eventName: true,
            startDate: true,
            status: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    }),
  ]);

  const recentEvents = events.map((event) =>
    formatEventSummary({ ...event, _viewerId: req.user.id }),
  );
  const registeredCount = registrations.length;
  const upcomingCount = recentEvents.filter(
    (event) => event.status === "upcoming" || event.status === "active",
  ).length;
  const collegeCount = recentEvents.filter(
    (event) => event.organizationId === req.user.organizationId,
  ).length;

  return successResponse(
    res,
    {
      overview: {
        stats: {
          registeredCount,
          upcomingCount,
          collegeCount,
        },
        recentEvents,
      },
    },
    "Student overview fetched successfully",
    200,
  );
}

export async function listStudentEvents(req, res) {
  const events = await prisma.event.findMany({
    where: buildStudentEventWhere(req.user),
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
      registrations: {
        where: { userId: req.user.id },
        select: { id: true, userId: true, status: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return successResponse(
    res,
    {
      events: events.map((event) =>
        formatEventSummary({ ...event, _viewerId: req.user.id }),
      ),
    },
    "Student events fetched successfully",
    200,
  );
}

export async function getStudentEventById(req, res) {
  const eventId = Number(req.params.eventId);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  const event = await prisma.event.findFirst({
    where: {
      ...buildStudentEventWhere(req.user),
      id: eventId,
    },
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
      registrations: {
        where: { userId: req.user.id },
        select: {
          id: true,
          userId: true,
          status: true,
          registeredAt: true,
        },
      },
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  return successResponse(
    res,
    {
      event: formatEventSummary({ ...event, _viewerId: req.user.id }),
    },
    "Student event details fetched successfully",
    200,
  );
}
