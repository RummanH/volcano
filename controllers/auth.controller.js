async function httpRegister(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  const isExist = true;
  if (isExist) {
    return res.status(201).json({ error: true, message: "User already exists" });
  }

  return res.status(201).json({ message: "User created" });
}

async function httpLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Request body incomplete, both email and password are required" });
  }

  const isIncorrect = false;
  if (isIncorrect) {
    return res.status(201).json({ error: true, message: "Incorrect email or password" });
  }

  return res.status(200).json({ token: "ajsonwebtoken", token_type: "Bearer", expires_in: 86400 });
}

module.exports = { httpRegister, httpLogin };
