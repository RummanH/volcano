const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const createJWT = async function (objectToEncode) {
  return await jwt.sign(objectToEncode, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

async function httpRegister(req, res, next) {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  const isExist = await db("user").select("*").where("email", email);
  if (isExist.length > 0) {
    return res.status(409).json({ error: true, message: "User already exists" });
  }

  password = await bcrypt.hash(password, 10);
  const newUser = await db("user").insert({ email, password });
  if (newUser) {
    return res.status(201).json({ message: "User created" });
  }
}

async function httpLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  const user = await db("user").select("*").where("email", email);

  if (!user.length || !(await correctPassword(password, user[0].password))) {
    return res.status(401).json({ error: true, message: "Incorrect email or password" });
  }

  const token = await createJWT({ email: user[0].email });
  const decodedToken = jwt.decode(token);
  const expires_in = new Date(decodedToken.exp * 1000);

  return res.status(200).json({ token: token, token_type: "Bearer", expires_in });
}

module.exports = { httpRegister, httpLogin };
