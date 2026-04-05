import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

export const getVolunteerDashboard = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      role: true,
      organization: { select: { collegeName: true } },
      department: { select: { DepartmentName: true } },
    },
  });

  const profile = {
    name: user.name,
    role: "Volunteer",
    college: user.organization?.collegeName,
    email: user.email,
    department: user.department?.DepartmentName || "General",
    initials: user.name.substring(0, 2).toUpperCase(),
  };

  const tasks = await prisma.task.findMany({
    where: { assignedTo: userId },
    include: { event: { select: { eventName: true, status: true } } },
    orderBy: { dueDate: "asc" },
  });

  return successResponse(res, { profile, tasks }, "Volunteer dashboard data fetched");
};

export const getAssignEvents = async (req, res) => {
  const userId = req.user.id;

  // Find all events this volunteer has tasks in
  const events = await prisma.event.findMany({
    where: {
      tasks: { some: { assignedTo: userId } },
    },
    include: {
      tasks: {
        where: { assignedTo: userId },
      },
      registrations: true,
    },
    orderBy: { startDate: "asc" },
  });

  const formattedEvents = events.map((e) => {
    return {
      id: e.id,
      name: e.eventName,
      date: e.startDate,
      location: e.venue,
      status: e.status,
      tasksTotal: e.tasks.length,
      tasksCompleted: e.tasks.filter((t) => t.status === "done").length,
      participants: e.registrations.length,
    };
  });

  return successResponse(res, { events: formattedEvents }, "Volunteer events fetched");
};

export const getAssignedTasks = async (req, res) => {
  const userId = req.user.id;

  const tasks = await prisma.task.findMany({
    where: { assignedTo: userId },
    include: { event: { select: { eventName: true } } },
    orderBy: { dueDate: "asc" },
  });

  const formattedTasks = tasks.map((t) => ({
    id: t.id,
    eventId: t.eventId,
    eventName: t.event.eventName,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
  }));

  return successResponse(res, { tasks: formattedTasks }, "Volunteer tasks fetched");
};

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const task = await prisma.task.findFirst({
    where: { id: parseInt(taskId), assignedTo: userId },
  });

  if (!task) {
    throw new AppError("Task not found or not assigned to you", 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: parseInt(taskId) },
    data: { status },
  });

  return successResponse(res, { task: updatedTask }, "Task updated successfully");
};

export const getEventParticipants = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  // Check if volunteer is assigned to this event
  const isAssigned = await prisma.task.findFirst({
    where: { eventId: parseInt(eventId), assignedTo: userId },
  });

  if (!isAssigned) {
    throw new AppError("You are not assigned to this event", 403);
  }

  // Get event to retrieve registration form schema
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
    select: { registrationFormSchema: true },
  });

  const registrations = await prisma.registration.findMany({
    where: { eventId: parseInt(eventId) },
    include: { 
      user: { 
        select: { 
          name: true, 
          email: true, 
          department: { select: { ShortName: true } } 
        } 
      } 
    },
    orderBy: { registeredAt: "asc" },
  });

  const participants = registrations.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    name: r.user?.name || r.formResponse?.name || "Guest",
    email: r.user?.email || r.formResponse?.email || "N/A",
    dept: r.user?.department?.ShortName || r.formResponse?.department || "Guest",
    regDate: r.registeredAt,
    attended: r.attended,
    formResponse: r.formResponse || {},
  }));

  // Get form field labels for dynamic columns
  const formFields = event?.registrationFormSchema?.fields || [];

  return successResponse(res, { participants, formFields }, "Event participants fetched");
};

export const markAttendance = async (req, res) => {
  const { registrationId } = req.params;
  const { attended } = req.body;
  const userId = req.user.id;

  const registration = await prisma.registration.findUnique({
    where: { id: parseInt(registrationId) },
  });

  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  // Check authorization
  const isAssigned = await prisma.task.findFirst({
    where: { eventId: registration.eventId, assignedTo: userId },
  });

  if (!isAssigned) {
    throw new AppError("You are not assigned to this event", 403);
  }

  const updatedReq = await prisma.registration.update({
    where: { id: parseInt(registrationId) },
    data: { attended },
  });

  return successResponse(res, { registration: updatedReq }, "Attendance marked successfully");
};

export const assignVolunteer = async (req, res) => {
  const { email, eventId, title, description, priority } = req.body;
  const coordinatorId = req.user.id;

  // Validate required fields
  if (!email || !eventId || !title) {
    throw new AppError("Email, event ID, and task title are required", 400);
  }

  // Check if coordinator has permission (must be from same organization)
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
    select: { organizationId: true },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const coordinator = await prisma.user.findUnique({
    where: { id: coordinatorId },
    select: { organizationId: true },
  });

  if (event.organizationId !== coordinator.organizationId) {
    throw new AppError("You do not have permission to assign volunteers to this event", 403);
  }

  // Look up existing student by email within the same organization
  const existingUser = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { 
      id: true, 
      organizationId: true,
      name: true,
      email: true,
      department: { select: { DepartmentName: true } }
    },
  });

  if (!existingUser) {
    throw new AppError("Student with this email not found", 404);
  }

  if (existingUser.organizationId !== event.organizationId) {
    throw new AppError("Student does not belong to your organization", 403);
  }

  // Create task and assign to volunteer
  const task = await prisma.task.create({
    data: {
      eventId: parseInt(eventId),
      assignedTo: existingUser.id,
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || "medium",
      status: "pending",
    },
    include: {
      event: { select: { eventName: true } },
      assignee: { select: { name: true, email: true } },
    },
  });

  return successResponse(
    res,
    {
      task,
      volunteer: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        department: existingUser.department?.DepartmentName || "General",
      },
    },
    "Volunteer assigned successfully"
  );
};

export const getEventVolunteers = async (req, res) => {
  const { eventId } = req.params;
  const coordinatorId = req.user.id;

  // Check if coordinator has permission
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
    select: { organizationId: true },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const coordinator = await prisma.user.findUnique({
    where: { id: coordinatorId },
    select: { organizationId: true },
  });

  if (event.organizationId !== coordinator.organizationId) {
    throw new AppError("You do not have permission to view volunteers for this event", 403);
  }

  // Get all tasks assigned for this event
  const tasks = await prisma.task.findMany({
    where: { eventId: parseInt(eventId) },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          department: { select: { DepartmentName: true } },
        },
      },
    },
  });

  const volunteers = tasks.map((t) => ({
    id: t.id,
    taskId: t.id,
    name: t.assignee?.name || "Unknown",
    email: t.assignee?.email,
    department: t.assignee?.department?.DepartmentName || "General",
    role: t.title,
    status: t.status === "pending" ? "pending" : "confirmed",
    priority: t.priority,
  }));

  return successResponse(res, { volunteers }, "Event volunteers fetched");
};
