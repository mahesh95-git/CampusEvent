import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";


export async function uploadCollegeLogo(req, res) {
  const file = req.files?.[0];
  if (!file) {
    throw new AppError("No file provided", 400);
  }

  const { organizationId } = req.body;

  if (!organizationId) {
    throw new AppError("Organization ID is required", 400);
  }

  // Verify organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(organizationId) },
  });

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "campus-event/college-logos",
          resource_type: "auto",
          format: "webp",
          quality: "auto",
          max_width: 500,
          crop: "fill",
          gravity: "auto",
          public_id: `college-${organizationId}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
    console.log("Cloudinary upload result:", result);

    // Update organization with logo URL
    await prisma.organization.update({
      where: { id: parseInt(organizationId) },
      data: { logoUrl: result.secure_url },
    });

    return successResponse(
      res,
      { data: { logoUrl: result.secure_url } },
      "College logo uploaded successfully",
      200
    );
  } catch (error) {
    throw new AppError("File upload failed: " + error.message, 500);
  }
}


export async function uploadEventBanner(req, res) {
  const file = req.files?.[0];
  if (!file) {
    throw new AppError("No file provided", 400);
  }

  const { eventId } = req.body;

  // If eventId is not provided or is 0, just upload without updating DB
  if (eventId && eventId > 0) {
    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "campus-event/event-banners",
          resource_type: "auto",
          format: "webp",
          quality: "auto",
          max_width: 1200,
          crop: "fill",
          gravity: "auto",
          public_id: eventId && eventId > 0 ? `event-${eventId}` : `event-temp-${Date.now()}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });

    // Only update DB if eventId is valid
    if (eventId && eventId > 0) {
      await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: { bannerUrl: result.secure_url },
      });
    }

    return successResponse(
      res,
      { data: { bannerUrl: result.secure_url } },
      "Event banner uploaded successfully",
      200
    );
  } catch (error) {
    throw new AppError("File upload failed: " + error.message, 500);
  }
}


export async function uploadProfilePicture(req, res) {
  const file = req.files?.[0];
  if (!file) {
    throw new AppError("No file provided", 400);
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "campus-event/user-profiles",
          resource_type: "auto",
          format: "webp",
          quality: "auto",
          max_width: 400,
          crop: "fill",
          gravity: "face",
          public_id: `user-${userId}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });

    // Update user with profile picture URL
    await prisma.user.update({
      where: { id: userId },
      data: { profilePictureUrl: result.secure_url },
    });

    return successResponse(
      res,
      { data: { profilePictureUrl: result.secure_url } },
      "Profile picture uploaded successfully",
      200
    );
  } catch (error) {
    throw new AppError("File upload failed: " + error.message, 500);
  }
}

export async function uploadJudgeResultFile(req, res) {
  const file = req.files?.[0];

  if (!file) {
    throw new AppError("No file provided", 400);
  }

  const { eventId, roundLabel } = req.body;

  if (!eventId || !roundLabel?.trim()) {
    throw new AppError("Event ID and round label are required", 400);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "campus-event/judge-results",
          resource_type: "auto",
          public_id: `event-${eventId}-round-${roundLabel.trim().replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        },
      );

      uploadStream.end(file.buffer);
    });

    return successResponse(
      res,
      {
        data: {
          fileUrl: result.secure_url,
          fileName: file.originalname,
          fileType: file.mimetype,
          publicId: result.public_id,
        },
      },
      "Judge result file uploaded successfully",
      200,
    );
  } catch (error) {
    throw new AppError("File upload failed: " + error.message, 500);
  }
}


export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}
