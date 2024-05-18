const express = require("express");
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const globalErrorHandler = require("./controllers/error.controller");
const corsOptions = require("./services/corsOptions");
const volcanoRouter = require("./routes/volcano.routes");
const userRouter = require("./routes/user.router");
const AppError = require("./services/AppError");
const app = express();
// app.use(express.static(path.join(__dirname, "..", "public")));
app.use(helmet());
app.use(cors(corsOptions));
// Read the Swagger JSON file
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'swagger.json'), 'utf-8'));



app.use("/", volcanoRouter);
app.use("/user", userRouter);



app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.all("*", (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));
app.use(globalErrorHandler);

module.exports = app;
