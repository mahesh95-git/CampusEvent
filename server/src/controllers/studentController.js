import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

const DEFAULT_PLAN = {
  term: "Semester 2, 2026",
  volunteerGoal: 2,
  milestones: [
    {
      title: "Build your event mix",
      description:
        "Choose one technical event, one culture event, and one public networking event to keep your semester balanced.",
      status: "In progress",
      actions: ["Pick 3 events", "Save dates", "Invite a classmate"],
    },
    {
      title: "Try one leadership role",
      description:
        "Join at least one volunteer activity so your profile shows hands-on campus involvement.",
      status: "Planned",
      actions: ["Apply to volunteer", "Attend briefing", "Check task board"],
    },
    {
      title: "Close the semester strongly",
      description:
        "Finish with attendance above 80% and collect participation proof for your portfolio.",
      status: "Done",
      actions: ["Track attendance", "Request certificate", "Update profile"],
    },
  ],
  focusAreas: [
    { label: "Academic exposure", progress: "75%" },
    { label: "Campus involvement", progress: "60%" },
    { label: "Leadership practice", progress: "40%" },
  ],
  recommendations: [
    {
      title: "Register for one more public event",
      description:
        "A public talk or expo will add external exposure alongside your college activities.",
    },
    {
      title: "Convert interest into confirmed attendance",
      description:
        "Two of your joined events are coming up soon, so now is a good time to block the dates in advance.",
    },
    {
      title: "Prepare a small event portfolio",
      description:
        "Keep screenshots, certificates, and attendance records together for internship or club applications.",
    },
  ],
};

function formatEventSummary(event) {
  return {
    id: event.id,
    organizationId: event.organizationId,
    eventName: event.eventName,
    description: event.description,
    eventBanner: event.eventBanner,
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

async function ensureStudentPlan(userId) {
  const existingPlan = await prisma.studentPlan.findUnique({
    where: { userId },
  });

  if (existingPlan) {
    return existingPlan;
  }

  return prisma.studentPlan.create({
    data: {
      userId,
      ...DEFAULT_PLAN,
    },
  });
}

function normalizeStudentPlan(plan) {
  return {
    id: plan.id,
    term: plan.term,
    volunteerGoal: `${plan.volunteerGoal} events`,
    volunteerGoalCount: plan.volunteerGoal,
    milestones: Array.isArray(plan.milestones) ? plan.milestones : [],
    focusAreas: Array.isArray(plan.focusAreas) ? plan.focusAreas : [],
    recommendations: Array.isArray(plan.recommendations)
      ? plan.recommendations
      : [],
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

function buildPlanStats({ registrations, historyCount, volunteerGoalCount }) {
  const attendedCount = registrations.filter(
    (registration) => registration.status?.toLowerCase() === "attended",
  ).length;
  const completedHistory = historyCount || registrations.length;
  const attendanceScore = Math.round(
    (attendedCount / Math.max(completedHistory, 1)) * 100,
  );

  return {
    registeredCount: registrations.length,
    attendedCount,
    attendanceScore,
    volunteerGoalCount,
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

export async function getStudentPlan(req, res) {
  const [plan, registrations, recommendedEvents] = await Promise.all([
    ensureStudentPlan(req.user.id),
    prisma.registration.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          select: {
            id: true,
            eventName: true,
            startDate: true,
          },
        },
      },
    }),
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
      orderBy: { startDate: "asc" },
      take: 3,
    }),
  ]);

  const normalizedPlan = normalizeStudentPlan(plan);
  const stats = buildPlanStats({
    registrations,
    historyCount: registrations.length,
    volunteerGoalCount: normalizedPlan.volunteerGoalCount,
  });

  return successResponse(
    res,
    {
      plan: normalizedPlan,
      stats,
      recommendedEvents: recommendedEvents.map((event) =>
        formatEventSummary({ ...event, _viewerId: req.user.id }),
      ),
      profile: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        yearOfStudy: req.user.yearOfStudy,
        department: req.user.department
          ? {
              id: req.user.department.id,
              name: req.user.department.DepartmentName,
              shortName: req.user.department.ShortName,
            }
          : null,
      },
    },
    "Student plan fetched successfully",
    200,
  );
}

export async function updateStudentPlan(req, res) {
  const { term, volunteerGoal, milestones, focusAreas, recommendations } = req.body;

  const currentPlan = await ensureStudentPlan(req.user.id);
  const nextVolunteerGoal = Number(volunteerGoal ?? currentPlan.volunteerGoal);

  if (
    volunteerGoal !== undefined &&
    (!Number.isInteger(nextVolunteerGoal) || nextVolunteerGoal < 0)
  ) {
    throw new AppError("Volunteer goal must be a valid non-negative integer.", 400);
  }

  const updatedPlan = await prisma.studentPlan.update({
    where: { userId: req.user.id },
    data: {
      term: typeof term === "string" && term.trim() ? term.trim() : currentPlan.term,
      volunteerGoal: nextVolunteerGoal,
      milestones: Array.isArray(milestones) ? milestones : currentPlan.milestones,
      focusAreas: Array.isArray(focusAreas) ? focusAreas : currentPlan.focusAreas,
      recommendations: Array.isArray(recommendations)
        ? recommendations
        : currentPlan.recommendations,
    },
  });

  return successResponse(
    res,
    { plan: normalizeStudentPlan(updatedPlan) },
    "Student plan updated successfully",
    200,
  );
}
