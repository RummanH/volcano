const { Router } = require("express");
const catchAsync = require("../services/catchAsync");

const { httpGetAllVolcanos } = require("../controllers/volcano.controller");

const router = Router();

router.route("/volcanoes").get(catchAsync(httpGetAllVolcanos));
router.route("/volcanoes").get(catchAsync(httpGetAllVolcanos));

module.exports = router;
