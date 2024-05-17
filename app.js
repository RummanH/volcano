const path = require("path");

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const globalErrorHandler = require("./controllers/error.controller");
const corsOptions = require("./services/corsOptions");
const volcanoRouter = require("./routes/volcano.routes");

const AppError = require("./services/AppError");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(helmet());

app.use(cors(corsOptions));

app.use("/", volcanoRouter);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.all("*", (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));

app.use(globalErrorHandler);

module.exports = app;
