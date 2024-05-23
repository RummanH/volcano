// Core node Modules
const fs = require("fs");
const path = require("path");

// 3rd Party libraries
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

// Own modules
const globalErrorHandler = require("./controllers/error.controller");
const { getMe } = require("./controllers/profile.controller");
const volcanoRouter = require("./routes/volcano.routes");
const corsOptions = require("./services/corsOptions");
const userRouter = require("./routes/user.router");
const AppError = require("./services/AppError");

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, "swagger.json"), "utf-8"));

const app = express();

// app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Custom middleware to serve Swagger at the root route
app.use("/", (req, res, next) => {
  if (req.path === '/') {
    swaggerUi.setup(swaggerDocument)(req, res, next);
  } else {
    next();
  }
});

// Serve Swagger UI assets
app.use("/", swaggerUi.serve);


app.use(helmet());
app.use(cors());



app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// API Routes
app.use("/", volcanoRouter);
app.use("/user", userRouter);
app.get("/me", getMe);
app.all("*", (req, res, next) => next(new AppError(`Not Found`, 404)));
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.use(globalErrorHandler);

module.exports = app;
