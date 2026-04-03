import { prisma } from "../../lib/prisma.js";
import AppError from "../utils/AppError.js";
import {
  AUTH_COOKIE_NAME,
  parseCookies,
  verifyAuthToken,
} from "../utils/authCookie.js";

export default async function requireAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const authorizationHeader = req.headers.authorization || "";
  const bearerToken = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice(7).trim()
    : null;
  const token = bearerToken || cookies[AUTH_COOKIE_NAME];
  const payload = verifyAuthToken(token);

  if (!payload?.userId) {
    return next(new AppError("Authentication required.", 401));
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
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
    return next(new AppError("Authentication required.", 401));
  }

  req.user = user;
  return next();
}
