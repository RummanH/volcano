// Importing necessary services
const AppError = require("../services/AppError"); // Custom error class for handling application errors
const sendResponse = require("../services/response"); // Utility for sending responses

// Function to send detailed error responses during development
function sendErrorDev(err, res) {
  return sendResponse({
    statusCode: err.statusCode, // HTTP status code from the error object
    message: err.message, // Error message from the error object
    res, // Express response object
  });
}

// Function to handle invalid JWT token errors
function handleJWTError() {
  return new AppError("Invalid JWT token", 401); // Creates a new AppError with a 401 Unauthorized status
}

// Function to handle expired JWT token errors
function handleTokenExpireError() {
  return new AppError("JWT token has expired", 401); // Creates a new AppError with a 401 Unauthorized status
}

// Function to handle malformed JWT token errors
function handleTokenUnauthorizedError() {
  return new AppError("Authorization header is malformed", 401); // Creates a new AppError with a 401 Unauthorized status
}

// Global error handling middleware
function globalErrorHandler(err, req, res, next) {
  // Setting default status code and status if they are not set
  err.statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
  err.status = err.status || "error"; // Default status message

  console.log(err.message); // Logging the error message for debugging purposes

  // Handling specific JWT errors
  if (err.name === "JsonWebTokenError" && err.message != "jwt malformed") err = handleJWTError(); // Handle invalid JWT token
  if (err.name === "TokenExpiredError") err = handleTokenExpireError(); // Handle expired JWT token
  if (err.message == "jwt malformed") err = handleTokenUnauthorizedError(); // Handle malformed JWT token

  // Sending the error response during development
  sendErrorDev(err, res);
}

// Exporting the global error handler middleware
module.exports = globalErrorHandler;
