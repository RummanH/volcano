// Importing required libraries and modules
const knex = require("knex"); // Knex.js is a SQL query builder for Node.js
const knexConfig = require("../knexfile").development; // Importing Knex configuration for the development environment
const db = knex(knexConfig); // Initializing Knex with the development configuration
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for creating and verifying JSON Web Tokens (JWT)

// Function to compare candidate password with stored hashed password
const correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Function to create a JWT with a specified payload
const createJWT = async function (objectToEncode) {
  return await jwt.sign(objectToEncode, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time from environment variables
  });
};

// Handler for user registration
async function httpRegister(req, res, next) {
  let { email, password } = req.body; // Extract email and password from request body

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400) // HTTP status code for Bad Request
      .json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  // Check if a user with the provided email already exists
  const isExist = await db("user").select("*").where("email", email);
  if (isExist.length > 0) {
    return res.status(409).json({ error: true, message: "User already exists" }); // HTTP status code for Conflict
  }

  // Hash the password
  password = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const newUser = await db("user").insert({ email, password });
  if (newUser) {
    return res.status(201).json({ message: "User created" }); // HTTP status code for Created
  }
}

// Handler for user login
async function httpLogin(req, res, next) {
  const { email, password } = req.body; // Extract email and password from request body

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400) // HTTP status code for Bad Request
      .json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  // Retrieve user from the database by email
  const user = await db("user").select("*").where("email", email);

  // Check if user exists and if the password is correct
  if (!user.length || !(await correctPassword(password, user[0].password))) {
    return res.status(401).json({ error: true, message: "Incorrect email or password" }); // HTTP status code for Unauthorized
  }

  // Create a JWT for the user
  const token = await createJWT({ email: user[0].email });

  // Decode the JWT to get its expiration time
  const decodedToken = jwt.decode(token);
  const expires_in = new Date(decodedToken.exp * 1000); // Convert expiration time from seconds to milliseconds

  // Respond with the token and its details
  return res.status(200).json({ token: token, token_type: "Bearer", expires_in: 86400 }); // HTTP status code for OK
}

// Exporting the registration and login handlers
module.exports = { httpRegister, httpLogin };
