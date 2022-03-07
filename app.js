const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const {
  invalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

app.use(cors());
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", invalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
