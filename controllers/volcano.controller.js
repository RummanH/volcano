const sendResponse = require("../services/response");
const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);

async function httpGetAllVolcanos(req, res, next) {
  const { country, populatedWithin } = req.query;
  if (!country) {
    return res.status(200).json({ error: true, message: "Country is a required query parameter." });
  }
  // Build the base query
  let query = db("data").select("id", "name", "region", "subregion").where("country", country);

  // Add population conditions only if populatedWithin is provided
  if (populatedWithin) {
    query = query.andWhere(function () {
      this.orWhere("population_5km", populatedWithin)
        .orWhere("population_10km", populatedWithin)
        .orWhere("population_30km", populatedWithin)
        .orWhere("population_100km", populatedWithin);
    });
  }
  const users = await query;
  res.status(400).json(users);
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
      "volcano.population_100km"
    )
    .where("id", id)
    .first();
  if (!volcano) {
    return res.status(404).json({ error: true, message: `Volcano with ID: ${id} not found.` });
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  const decodedObject = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decodedObject) {
    delete volcano.population_5km;
    delete volcano.population_10km;
    delete volcano.population_30km;
    delete volcano.population_100km;
  }

  res.status(200).json(volcano);
}

async function httpGetCountry(req, res, next) {
  const countries = await db("data").distinct("country").orderBy("country", "asc"); // Order by country name in descending order
  const countryList = countries.map((row) => row.country);
  res.json(countryList);
}

module.exports = {
  httpGetAllVolcanos,
  httpGetOneVolcano,
  httpGetCountry,
};
