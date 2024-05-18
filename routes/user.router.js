const { Router } = require("express");
const catchAsync = require("../services/catchAsync");

const { httpRegister, httpLogin } = require("../controllers/auth.controller");
const { httpGetProfile, httpUpdateProfile } = require("../controllers/profile.controller");

const router = Router();

router.route("/register").post(catchAsync(httpRegister));
router.route("/login").post(catchAsync(httpLogin));
router.route("/:email/profile").get(catchAsync(httpGetProfile));
router.route("/:email/profile").put(catchAsync(httpUpdateProfile));

module.exports = router;
