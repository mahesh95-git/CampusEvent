import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

function normalizeResultFile(file) {
  return {
    id: file.id,
    eventId: file.eventId,
    judgeId: file.judgeId,
    roundLabel: file.roundLabel,
    title: file.title,
    fileUrl: file.fileUrl,
    fileName: file.fileName,
    fileType: file.fileType,
    summary: file.summary,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

function normalizeScore(score) {
  return {
    id: score.id,
    eventId: score.eventId,
    registrationId: score.registrationId,
    judgeId: score.judgeId,
    roundLabel: score.roundLabel,
    marks: score.marks,
    remarks: score.remarks,
    createdAt: score.createdAt,
    updatedAt: score.updatedAt,
    participant: score.registration
      ? {
          id: score.registration.id,
          name: score.registration.user?.name || "Unknown",
          email: score.registration.user?.email || "Unknown",
        }
      : null,
  };
}

function normalizeAssignment(assignment) {
  return {
    eventId: assignment.eventId,
    assignedAt: assignment.assignedAt,
    event: assignment.event
      ? {
          id: assignment.event.id,
          eventName: assignment.event.eventName,
          status: assignment.event.status,
          startDate: assignment.event.startDate,
          endDate: assignment.event.endDate,
          venue: assignment.event.venue,
          registrationsCount: assignment.event._count?.registrations ?? 0,
          judgeScoresCount: assignment.event._count?.judgeScores ?? 0,
          judgeResultsCount: assignment.event._count?.judgeResults ?? 0,
        }
      : null,
  };
}

function normalizeEventWithJudgeData(event) {
  const mappedParticipants = (event.registrations || []).map((registration) => {
    const user = registration.user;
    return {
      id: registration.id,
      registeredAt: registration.registeredAt,
      status: registration.status,
      paymentStatus: registration.paymentStatus,
      amountPaid: registration.amountPaid,
      attended: registration.attended,
      formResponse: registration.formResponse || {},
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        contactPhone: user.contactPhone,
        department: user.department,
      } : null,
    };
  });

  return {
    id: event.id,
    eventName: event.eventName,
    description: event.description,
    bannerUrl: event.bannerUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    registrationDeadline: event.registrationDeadline,
    venue: event.venue,
    status: event.status,
    organizationId: event.organizationId,
    createdBy: event.createdBy,
    creator: event.creator,
    participants: mappedParticipants,
    judgeScores: event.judgeScores.map(normalizeScore),
    judgeResults: event.judgeResults.map(normalizeResultFile),
    counts: {
      registrations: event._count?.registrations || 0,
      judgeScores: event._count?.judgeScores || 0,
      judgeResults: event._count?.judgeResults || 0,
    },
    departments: (event.departments || []).map((link) => ({
      id: link.department.id,
      name: link.department.DepartmentName,
      shortName: link.department.ShortName,
      color: link.department.colourCode,
    })),
  };
}

async function getAssignedEventOrThrow(eventId, judgeId) {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      judgeAssignments: {
        some: {
          judgeId,
        },
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
        },
        orderBy: {
          registeredAt: "desc",
        },
      },
      judgeScores: {
        where: {
          judgeId,
        },
        include: {
          registration: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
      judgeResults: {
        orderBy: {
          updatedAt: "desc",
        },
      },
      _count: {
        select: {
          registrations: true,
          judgeScores: true,
          judgeResults: true,
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
    },
  });

  if (!event) {
    throw new AppError("Event not found or not assigned to you.", 404);
  }

  return event;
}

export async function getJudgeDashboard(req, res) {
  const assignments = await prisma.eventJudgeAssignment.findMany({
    where: {
      judgeId: req.user.id,
    },
    include: {
      event: {
        include: {
          _count: {
            select: {
              registrations: true,
              judgeScores: true,
              judgeResults: true,
            },
          },
        },
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  return successResponse(
    res,
    {
      dashboard: {
        judge: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          college: req.user.organization?.collegeName || "",
        },
        stats: {
          assignedEvents: assignments.length,
          activeEvents: assignments.filter((item) => item.event?.status === "active").length,
          totalResults: assignments.reduce((sum, item) => sum + (item.event?._count?.judgeResults ?? 0), 0),
          totalScores: assignments.reduce((sum, item) => sum + (item.event?._count?.judgeScores ?? 0), 0),
        },
        events: assignments.map(normalizeAssignment),
      },
    },
    "Judge dashboard fetched successfully",
    200,
  );
}

export async function listJudgeEvents(req, res) {
  const assignments = await prisma.eventJudgeAssignment.findMany({
    where: {
      judgeId: req.user.id,
    },
    include: {
      event: {
        include: {
          _count: {
            select: {
              registrations: true,
              judgeScores: true,
              judgeResults: true,
            },
          },
        },
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  return successResponse(
    res,
    {
      events: assignments.map(normalizeAssignment),
    },
    "Judge events fetched successfully",
    200,
  );
}

export async function getJudgeEventById(req, res) {
  const eventId = Number(req.params.eventId);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  const event = await getAssignedEventOrThrow(eventId, req.user.id);

  return successResponse(
    res,
    {
      event: normalizeEventWithJudgeData(event),
    },
    "Judge event fetched successfully",
    200,
  );
}

export async function upsertJudgeScore(req, res) {
  const eventId = Number(req.params.eventId);
  const { registrationId, roundLabel, marks, remarks } = req.body;

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  if (!registrationId || !roundLabel?.trim() || marks === undefined || marks === null) {
    throw new AppError("Registration, round label, and marks are required.", 400);
  }

  const numericMarks = Number(marks);

  if (Number.isNaN(numericMarks) || numericMarks < 0) {
    throw new AppError("Marks must be a valid positive number.", 400);
  }

  const event = await getAssignedEventOrThrow(eventId, req.user.id);
  const registration = event.registrations.find((item) => item.id === Number(registrationId));

  if (!registration) {
    throw new AppError("Selected participant is not registered for this event.", 400);
  }

  const score = await prisma.judgeScore.upsert({
    where: {
      eventId_registrationId_judgeId_roundLabel: {
        eventId,
        registrationId: Number(registrationId),
        judgeId: req.user.id,
        roundLabel: roundLabel.trim(),
      },
    },
    update: {
      marks: numericMarks,
      remarks: remarks?.trim() || null,
    },
    create: {
      eventId,
      registrationId: Number(registrationId),
      judgeId: req.user.id,
      roundLabel: roundLabel.trim(),
      marks: numericMarks,
      remarks: remarks?.trim() || null,
    },
    include: {
      registration: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return successResponse(
    res,
    {
      score: normalizeScore(score),
    },
    "Judge score saved successfully",
    200,
  );
}

export async function createJudgeResultFile(req, res) {
  const eventId = Number(req.params.eventId);
  const { roundLabel, title, fileUrl, fileName, fileType, summary } = req.body;

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new AppError("Valid event id is required.", 400);
  }

  if (!roundLabel?.trim() || !title?.trim() || !fileUrl?.trim() || !fileType?.trim()) {
    throw new AppError("Round, title, file URL, and file type are required.", 400);
  }

  await getAssignedEventOrThrow(eventId, req.user.id);

  const resultFile = await prisma.judgeResultFile.create({
    data: {
      eventId,
      judgeId: req.user.id,
      roundLabel: roundLabel.trim(),
      title: title.trim(),
      fileUrl: fileUrl.trim(),
      fileName: fileName?.trim() || null,
      fileType: fileType.trim(),
      summary: summary?.trim() || null,
    },
  });

  return successResponse(
    res,
    {
      result: normalizeResultFile(resultFile),
    },
    "Judge result file saved successfully",
    201,
  );
}
