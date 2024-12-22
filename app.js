const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const app = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

try {
  const filePath = path.join(__dirname, "docs", "api-doc.yaml");
  const file = fs.readFileSync(filePath, "utf-8");
  const swaggerDocument = YAML.parse(file);

  app.use("/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
} catch (error) {
  console.error("Error reading swagger file:", error);
}

app.use("/api/v1", routes);

app.get("/check-docs", (req, res) => {
  const docsPath = path.join(__dirname, "docs");
  fs.readdir(docsPath, (err, files) => {
    if (err) {
      return res.status(500).send("Could not list directory.");
    }
    res.json(files);
  });
});

app.use((req, res, next) => {
  console.log("Request URL:", req.url);
  console.log("Request Headers:", req.headers);
  next();
});

module.exports = app;
