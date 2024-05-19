async function httpGetProfile(req, res, next) {
  const { email } = req.params;

  const userNotExist = false;
  if (userNotExist) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  const isJWTExpired = false;
  if (isJWTExpired) {
    return res.status(401).json({ error: true, message: "JWT token has expired" });
  }

  const user = {
    email: "mike@gmail.com",
    firstName: "Michael",
    lastName: "Jordan",
    dob: "1963-02-17",
    address: "123 Fake Street, Springfield",
  };

  return res.status(200).json(user);
}


async function httpUpdateProfile(req, res, next) {
  const { firstName, lastName, dob, address } = req.body;
  const { email } = req.params;

  if (!firstName || !lastName || !dob || !address) {
    return res
      .status(400)
      .json({ error: true, message: "Request body incomplete: firstName, lastName, dob and address are required." });
  }

  const token = null;
  if (!token) {
    return res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });
  }

  const notSameUser = false;
  if (notSameUser) {
    return res.status(400).json({ error: true, message: "Forbidden" });
  }

  const userNotExist = false;
  if (userNotExist) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  const isJWTExpired = false;
  if (isJWTExpired) {
    return res.status(401).json({ error: true, message: "JWT token has expired" });
  }

  const user = {
    email: "mike@gmail.com",
    firstName: "Michael",
    lastName: "Jordan",
    dob: "1963-02-17",
    address: "123 Fake Street, Springfield",
  };

  return res.status(200).json(user);
}

async function getMe(req, res, next) {
  const meObject = {
    name: "Hussain Mohammadi",
    student_number: "n11435925",
  };

  return res.status(200).json(meObject);
}

module.exports = {  httpGetProfile, httpUpdateProfile, getMe };
