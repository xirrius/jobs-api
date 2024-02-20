require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDb = require("./db/connect");
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");
const authenticationMiddleware = require("./middleware/authentication");

// security middleware
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 1000 * 60,
    max: 100,
  })
);
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Jobs API</h1><a href="/api-docs">Documentation</a>`);
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/jobs", authenticationMiddleware, jobsRoute);
app.use("/api/v1/auth", authRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
