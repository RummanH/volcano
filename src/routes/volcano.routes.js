const { Router } = require("express");
const catchAsync = require("../services/catchAsync");

const { httpGetAllVolcanos } = require("../controllers/volcano.controller");

const router = Router();

router.route("/").get(catchAsync(httpGetAllVolcanos));

module.exports = router;
