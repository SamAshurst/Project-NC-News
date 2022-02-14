const express = require("express");
const { getTopics } = require("./controllers/news.controllers.js");
const { invalidEndpoint } = require("./controllers/errors.controllers.js");
const app = express();

app.get("/api/topics", getTopics);

app.get("/*", invalidEndpoint);
module.exports = app;
