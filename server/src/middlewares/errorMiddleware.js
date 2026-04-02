import AppError from "../utils/AppError.js";
import { errorResponse } from "../utils/apiResponse.js";

export default function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  console.error("Unhandled error:", err);
  return errorResponse(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500,
  );
}
