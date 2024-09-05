const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const file = fs.readFileSync("./docs/api-doc.yaml", "utf-8");
const swaggerDocument = YAML.parse(file);

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://api-bewise.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api/v1", routes);

module.exports = app;
