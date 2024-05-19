const { promisify } = require("util");
const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const jwt = require("jsonwebtoken");

async function httpGetProfile(req, res, next) {
  const { email } = req.params;

  let decodedObject;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    decodedObject = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  const user = await db("user").select("*").where("email", email);
  if (!user.length) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  const userObject = {
    email: user[0].email,
    firstName: user[0].firstName,
    lastName: user[0].lastName,
    dob: user[0].dob,
    address: user[0].address,
  };

  if (!decodedObject) {
    delete userObject.address;
    delete userObject.dob;
  }

  return res.status(200).json(userObject);
}

async function httpUpdateProfile(req, res, next) {
  const { firstName, lastName, dob, address } = req.body;
  const { email } = req.params;

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

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });
  }

  const decodedObject = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const notSameUser = false;
  if (notSameUser) {
    return res.status(400).json({ error: true, message: "Forbidden" });
  }

  const userNotExist = false;
  if (userNotExist) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  if (decodedObject.email !== email) {
    return res.status(403).json({
      error: true,
      message: "Forbidden",
    });
  }

  await db("user").where({ email }).update({ firstName, lastName, dob, address });
  const updatedUser = await db("user").select("*").where("email", email);

  return res.status(200).json(updatedUser);
}

async function getMe(req, res, next) {
  const meObject = {
    name: "Hussain Mohammadi",
    student_number: "n11435925",
  };

  return res.status(200).json(meObject);
}

module.exports = { httpGetProfile, httpUpdateProfile, getMe };
