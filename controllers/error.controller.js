const AppError = require("../services/AppError");
const sendResponse = require("../services/response");

function sendErrorDev(err, res) {
  return sendResponse({
    statusCode: err.statusCode,
    message: err.message,
    res,
  });
}

function handleJWTError() {
  return new AppError("Invalid JWT token", 401);
}

function handleTokenExpireError() {
  return new AppError("JWT token has expired", 401);
}

function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(err.name);

  if (err.name === "JsonWebTokenError") err = handleJWTError();
  if (err.name === "TokenExpiredError") err = handleTokenExpireError();
  sendErrorDev(err, res);
}

module.exports = globalErrorHandler;
