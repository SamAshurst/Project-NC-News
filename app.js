const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const {
  invalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", invalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
