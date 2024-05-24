// This is a typical express router; Router accept request from app.js and send those requests to any of the controllers;
const { Router } = require("express");
const catchAsync = require("../services/catchAsync");

const { httpRegister, httpLogin } = require("../controllers/auth.controller");
const { httpGetProfile, httpUpdateProfile } = require("../controllers/profile.controller");

const router = Router();

// If request comes to this route depending on the Url request will go any of the controllers;
router.route("/register").post(catchAsync(httpRegister));
router.route("/login").post(catchAsync(httpLogin));
router.route("/:email/profile").get(catchAsync(httpGetProfile));
router.route("/:email/profile").put(catchAsync(httpUpdateProfile));

module.exports = router;
