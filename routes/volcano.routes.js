const { Router } = require("express");
const catchAsync = require("../services/catchAsync");

const { httpGetAllVolcanos, httpGetOneVolcano, httpGetCountry, httpCreateVolcano } = require("../controllers/volcano.controller");

const router = Router();

router.route("/volcanoes")
  .get(catchAsync(httpGetAllVolcanos))
  .post(catchAsync(httpCreateVolcano))
router.route("/volcano/:id").get(catchAsync(httpGetOneVolcano));
router.route("/countries").get(catchAsync(httpGetCountry));

module.exports = router;
