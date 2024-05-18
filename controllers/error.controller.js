const AppError = require("../services/AppError");
const sendResponse = require("../services/response");

function sendErrorDev(err, res) {
  return sendResponse({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    payload: null,
    res,
  });
}

function sendErrorProd(err, req, res) {
  if (err.isOperational) {
    return sendResponse({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      payload: null,
      res,
    });
  }

  return sendResponse({
    status: "error",
    statusCode: 500,
    message: "Something went wrong!",
    payload: null,
    res,
  });
}

function handleJWTError() {
  return new AppError("Invalid token. Please log in again!", 401);
}

function handleTokenExpireError() {
  return new AppError("Token expired. Please log in again!", 401);
}

function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleTokenExpireError();
    sendErrorProd(err, req, res);
  }
}

module.exports = globalErrorHandler;
