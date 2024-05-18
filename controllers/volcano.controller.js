const sendResponse = require("../services/response");
const knex = require('knex');
const knexConfig = require('../knexfile').development;
const db = knex(knexConfig);

async function httpGetAllVolcanos(req, res, next) {
  const users = await db('data').select('*');

  const payload = {};
  return sendResponse({
    status: "success",
    statusCode: 200,
    message: "Get tests successfully!",
    payload : users,
    res,
  });
}


async function httpGetOneVolcano(req, res, next) {
  const { id } = req.params;
  const users = await db('data').where('id', id).first();
  const payload = {};
  return sendResponse({
    status: "success",
    statusCode: 200,
    message: "Get tests successfully!",
    payload : users,
    res,
  });
}

module.exports = {
  httpGetAllVolcanos,
  httpGetOneVolcano
};
