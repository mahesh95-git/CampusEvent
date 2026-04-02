export function successResponse(res, payload = {}, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...payload,
  });
}

export function errorResponse(res, message = "Internal Server Error", statusCode = 500, errors = null) {
  const responseBody = {
    success: false,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
}
