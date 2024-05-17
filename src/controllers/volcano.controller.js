const sendResponse = require("../services/response");

async function httpGetAllVolcanos(req, res, next) {
  const searchString = req.query.search || "";
  const searchRegex = new RegExp(searchString, "i");
  let searchCriteria = {};
  // if (searchString) {
  //   searchCriteria = {
  //     $or: [{ name: searchRegex }, { description: searchRegex }],
  //   };
  // }
  // const features = new ApiFeatures(Test.find(searchCriteria), req.query, totalCount)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  // const tests = await features.query;
  // const payload = {
  //   totalCount: features.totalCount,
  //   totalPages: features.totalPages,
  //   currentPage: features.currentPage,
  //   currentCount: tests.length,
  //   tests,
  // };

  const payload = {};
  return sendResponse({
    status: "success",
    statusCode: 200,
    message: "Get tests successfully!",
    payload,
    res,
  });
}

module.exports = {
  httpGetAllVolcanos,
};
