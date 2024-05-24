// All the controllers functions will be wrapped with that function by doing this we don't need to use try catch make our code more cleaner.
const catchAsync = (fn) => (req, res, next) => {
  return fn(req, res, next).catch(next);
};

module.exports = catchAsync;
