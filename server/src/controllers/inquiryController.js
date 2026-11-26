import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

export async function submitInquiry(req, res) {
  const { name, collegeName, email, message } = req.body ?? {};

  if (
    typeof name !== "string" ||
    typeof collegeName !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    throw new AppError("Please complete all inquiry fields.", 400);
  }

  const normalizedName = name.trim();
  const normalizedCollegeName = collegeName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMessage = message.trim();

  if (
    !normalizedName ||
    normalizedName.length > 100 ||
    !normalizedCollegeName ||
    normalizedCollegeName.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    normalizedEmail.length > 254 ||
    !normalizedMessage ||
    normalizedMessage.length > 3000
  ) {
    throw new AppError("Please check the inquiry fields and try again.", 400);
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: normalizedName,
      collegeName: normalizedCollegeName,
      email: normalizedEmail,
      message: normalizedMessage,
    },
    select: { id: true },
  });

  return successResponse(
    res,
    { inquiryId: inquiry.id },
    "Inquiry submitted successfully",
    201,
  );
}
