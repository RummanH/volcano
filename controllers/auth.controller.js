const knex = require('knex');
const knexConfig = require('../knexfile').development;
const db = knex(knexConfig);
const bcrypt = require('bcrypt');

async function httpRegister(req, res, next) {
  let { email,password } = req.body;
  if (!email || !password) {
    return res.json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  const isExist = await db('user').select('*').where('email', email);
  if(isExist.length > 0){
    return res.json({ error: true, message: "User already exists" });
  }

  password = await bcrypt.hash(password, 10);
  const newUser = await db('user').insert({email,password});
  if(newUser){
    return res.json({ message: "User created" });
  }
  res.json(newUser);
}

async function httpLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "User Created" });
  }

  const isIncorrect = false;
  if (isIncorrect) {
    return res.status(201).json({ error: true, message: "Incorrect email or password" });
  }

  return res.status(200).json({ token: "ajsonwebtoken", token_type: "Bearer", expires_in: 86400 });
}

module.exports = { httpRegister, httpLogin };
