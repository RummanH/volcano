// Core node Modules
// It is a node convention to import core modules first then 3rd party modules and then own modules.
const fs = require("fs");
const path = require("path");

// 3rd Party libraries
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

// Own modules
const globalErrorHandler = require("./controllers/error.controller");
const { getMe } = require("./controllers/profile.controller");
const volcanoRouter = require("./routes/volcano.routes");
const userRouter = require("./routes/user.router");
const AppError = require("./services/AppError");

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, "swagger.json"), "utf-8"));

// Creating the express application;
const app = express();

// Helmet helps protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet());

// Setting additional headers according to the requirements;
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Custom middleware to serve Swagger at the root route
app.use("/", (req, res, next) => {
  if (req.path === "/") {
    swaggerUi.setup(swaggerDocument)(req, res, next);
  } else {
    next();
  }
});

// Serve Swagger UI assets
app.use("/", swaggerUi.serve);

// This middleware will parse request body and make them json format
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Express app will go any of this routes depending on request URL;
app.use("/", volcanoRouter);
app.use("/user", userRouter);
app.get("/me", getMe);

// If the requested URL doesn't exist express app will return 404 Not found;
app.all("*", (req, res, next) => next(new AppError(`Not Found`, 404)));

// This is express global error handler any error will be received by this middleware;
// In express if you pass anything inside next() Express treat that as an error and pass to that global error handler.
app.use(globalErrorHandler);

// Exporting the express app because we will run this app from server.js It is also a convention of express.js application.
module.exports = app;
