import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";

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


  console.log(req.body)
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

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const isOrganizationExists = await prisma.organization.findFirst({
    where: {
      OR: [
        { collegeSlug },
        { adminEmail },
      ],
    },
  });

  if (isOrganizationExists) {
    throw new AppError("College slug or admin email already exists.", 409);
  }

  const organization = await prisma.organization.create({
    data: {
      collegeName,
      collegeSlug,
      collegeType,
      establishedYear: Number(establishedYear),
      affiliatedUniversity,
      website: website || null,
      logoUrl: null,
      addressStreet: address.street,
      addressCity: address.city,
      addressPincode: address.pincode,
      addressState: address.state,
      adminName,
      adminEmail,
      contactPhone,
      adminPassword: passwordHash,
    },
  });

  return successResponse(res, { organization }, "Organization created successfully", 201);
}
