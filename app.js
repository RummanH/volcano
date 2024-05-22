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

const app = express();

app.use(helmet());
app.use(cors());

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, "swagger.json"), "utf-8"));

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// API Routes
app.use("/", volcanoRouter);
app.use("/user", userRouter);
app.get("/me", getMe);
app.get("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all("*", (req, res, next) => next(new AppError(`Not Found`, 404)));
app.use(globalErrorHandler);

module.exports = app;
