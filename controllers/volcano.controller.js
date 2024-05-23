const sendResponse = require("../services/response");
const knex = require("knex");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../services/AppError");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);

async function httpGetAllVolcanos(req, res, next) {
  const { country, populatedWithin } = req.query;
  const allowedParams = ['country', 'populatedWithin'];
  const queryParams = Object.keys(req.query);
  const invalidParams = queryParams.filter(param => !allowedParams.includes(param));
  if (invalidParams.length > 0) {
    return res.status(400).json({ error: true, message: "Invalid query parameters. Only country and populatedWithin are permitted." });
  }
  
  if(populatedWithin && populatedWithin != '5km' && populatedWithin != '10km' && populatedWithin != '30km' && populatedWithin != '100km'){
    return res.status(400).json({ error: true, message: "Invalid value for populatedWithin. Only: 5km,10km,30km,100km are permitted." });
  }

  if (!country) {
    return res.status(400).json({ error: true, message: "Country is a required query parameter." });
  }

  const populatedQuery = `population_${populatedWithin}`;
  // Build the base query
  let query = db("data").select("id", "name","country", "region", "subregion").where("country", country)
  
  // Add population conditions only if populatedWithin is provided

  if(populatedWithin){
    const populatedQuery = `population_${populatedWithin}`;
    query = query.andWhere(function () {
      this.andWhere(populatedQuery,">", 0)
    })
  }
  const volcanoes = await query
  res.status(200).json(volcanoes);
}

async function httpGetOneVolcano(req, res, next) {
  const { id } = req.params;
  if (Object.keys(req.query).length > 0) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid query parameters. Query parameters are not permitted." });
  }
  const volcano = await db("data")
    .select(
      "id",
      "name",
      "country",
      "region",
      "subregion",
      "last_eruption",
      "summit",
      "elevation",
      "latitude",
      "longitude",
      "population_5km",
      "population_10km",
      "population_30km",
      "population_100km"
    )
    .where("id", id)
    .first();
  if (!volcano) {
    return res.status(404).json({ error: true, message: `Volcano with ID: ${id} not found.` });
  }

  const authHeader = req.headers['authorization'];
  if(authHeader){
    const parts = authHeader.split(' ');
    const token = parts[1];
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError("Authorization header is malformed", 401))
    }

    const pattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if(!pattern.test(token)){
      return next(new AppError("Invalid JWT token", 401))
    }
    await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }


  if (!req.headers.authorization) {
    delete volcano.population_5km;
    delete volcano.population_10km;
    delete volcano.population_30km;
    delete volcano.population_100km;
  }

  res.status(200).json(volcano);
}

async function httpGetCountry(req, res, next) {
  if (Object.keys(req.query).length > 0) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid query parameters. Query parameters are not permitted." });
  }
  const countries = await db("data").distinct("country").orderBy("country", "asc"); // Order by country name in descending order
  const countryList = countries.map((row) => row.country);
  res
  .status(200)
  .json(countryList);
}

async function httpCreateVolcano(req,res,next){
  if (Object.keys(req.query).length > 0) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid query parameters. Query parameters are not permitted." });
  }

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } else {
    return res.status(401).json({"error": true,"message": "Invalid JWT token not provided"});
  }

  const allowedParams = [
    'name','country', 'region', 'subregion', 'last_eruption', 'summit', 'elevation', 'latitude',
    'population_5km', 'population_10km', 'population_30km', 'population_100km'
  ];

  const bodyParams = Object.keys(req.body);
  const missingParams = allowedParams.filter(param => !bodyParams.includes(param));

  if (missingParams.length > 0) {
    return res.status(400).json({ error: true, message: `Invalid request payload. ${missingParams} missing` });
  }

  const newVolcano = await db("data").insert(req.body)
  if (newVolcano) {
    return res.status(201).json({ message: "New volcano data created" });
  }
}

module.exports = {
  httpGetAllVolcanos,
  httpGetOneVolcano,
  httpGetCountry,
  httpCreateVolcano
};
