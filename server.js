const http = require("http");

// Dot env module reads environment variables from .env file and set them to the node process;
require("dotenv").config();

// Any exception that is uncaught by us will be caught by this event handler;
process.on("uncaughtException", (err) => {
  console.error(`Uncaught exception: ${err.name}, ${err.message}`);
  console.error("🤔 App is shutting down...");
  process.exit(1);
});

const app = require("./app");

// Creating the http server
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Starting the server with an IIFE In javaScript;
(async () => {
  try {
    server.listen(PORT, () => {
      console.log(`✔ Server is listening on port: ${PORT} in ${process.env.NODE_ENV} environment.`);
    });
  } catch (err) {
    console.error(`🤔 There was an error starting the server ${err}`);
  }
})();

// Any unhandled rejected will be handled by this event handler.
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection: ${err.name} ${err.message}`);
  console.error("🤔 App is shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
