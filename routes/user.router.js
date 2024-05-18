const { Router } = require("express");
const catchAsync = require("../services/catchAsync");

const { httpRegister, httpLogin } = require("../controllers/auth.controller");

const router = Router();

router.route("/register").post(catchAsync(httpRegister));
router.route("/login").post(catchAsync(httpLogin));

module.exports = router;
