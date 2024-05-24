// Importing necessary modules
const { promisify } = require("util"); // Utility to convert callback-based functions to promise-based
const knex = require("knex"); // SQL query builder for Node.js
const knexConfig = require("../knexfile").development; // Database configuration for development environment
const db = knex(knexConfig); // Initialize Knex with the development configuration
const jwt = require("jsonwebtoken"); // Library for creating and verifying JSON Web Tokens (JWT)
const validator = require("validator"); // Library for string validation

// Function to validate date strings in the format YYYY-MM-DD
function isValidDate(dateString) {
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for date format YYYY-MM-DD

  if (!dateString.match(dateFormat)) {
    return false; // Return false if date string does not match the format
  }

  const date = new Date(dateString); // Create a new Date object from the date string
  return !isNaN(date) && date.toISOString().slice(0, 10) === dateString; // Check if the date is valid and matches the input string
}

// Handler to get user profile
async function httpGetProfile(req, res, next) {
  const { email } = req.params; // Extract email from request parameters

  let decodedObject;

  // Check if the request has an authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const parts = req.headers.authorization.split(" ");
    if (
      parts.length === 2 &&
      parts[0] === "Bearer" &&
      parts[1].match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/) // Regex to validate JWT format
    ) {
      const token = req.headers.authorization.split(" ")[1]; // Extract the token
      decodedObject = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Verify the token
    } else {
      return res.status(401).json({ error: true, message: "Authorization header is malformed" }); // Return error if token is malformed
    }
  }

  const user = await db("user").select("*").where("email", email); // Query the database for the user with the given email
  if (!user.length) {
    return res.status(404).json({ error: true, message: "User not found" }); // Return error if user not found
  }

  const userObject = {
    email: user[0].email,
    firstName: user[0].firstName,
    lastName: user[0].lastName,
    dob: user[0].dob,
    address: user[0].address,
  };

  // If the token is not present or email in token does not match, remove sensitive fields
  if (!decodedObject) {
    delete userObject.address;
    delete userObject.dob;
  }

  if (decodedObject?.email !== email) {
    delete userObject.address;
    delete userObject.dob;
  }

  return res.status(200).json(userObject); // Return the user profile
}

// Handler to update user profile
async function httpUpdateProfile(req, res, next) {
  const { firstName, lastName, dob, address } = req.body; // Extract fields from request body
  const { email } = req.params; // Extract email from request parameters

  // Validate request body fields
  if (!firstName || !lastName || !dob || !address) {
    return res
      .status(400)
      .json({ error: true, message: "Request body incomplete: firstName, lastName, dob and address are required." });
  }

  if (typeof firstName !== "string" || typeof lastName !== "string" || typeof address !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "Request body invalid: firstName, lastName and address must be strings only." });
  }

  if (!isValidDate(dob)) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid input: dob must be a real date in format YYYY-MM-DD." });
  }

  const isPast = new Date(dob) < new Date(Date.now()); // Check if dob is a date in the past
  if (!isPast) {
    return res.status(400).json({ error: true, message: "Invalid input: dob must be a date in the past." });
  }

  let token;

  // Check if the request has an authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const parts = req.headers.authorization.split(" ");
    if (
      parts.length === 2 &&
      parts[0] === "Bearer" &&
      parts[1].match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/) // Regex to validate JWT format
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract the token
    } else {
      return res.status(401).json({ error: true, message: "Authorization header is malformed" }); // Return error if token is malformed
    }
  }

  if (!token) {
    return res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" }); // Return error if no token is found
  }

  const decodedObject = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Verify the token

  if (decodedObject.email !== email) {
    return res.status(403).json({
      error: true,
      message: "Forbidden", // Return error if token email does not match the requested email
    });
  }

  // Update user profile in the database
  await db("user").where({ email }).update({ firstName, lastName, dob, address });
  const updatedUser = await db("user").select("*").where("email", email).first(); // Get the updated user

  updatedUser.password = undefined; // Remove password from the response

  return res.status(200).json(updatedUser); // Return the updated user profile
}

// Handler to return static information about the developer
async function getMe(req, res, next) {
  const meObject = {
    name: "Hussain Mohammadi",
    student_number: "n11435925",
  };

  return res.status(200).json(meObject); // Return the static information
}

// Exporting the handlers
module.exports = { httpGetProfile, httpUpdateProfile, getMe };
