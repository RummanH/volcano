const allowedOrigins = new Set(["http://localhost:3000"]);

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.has(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
