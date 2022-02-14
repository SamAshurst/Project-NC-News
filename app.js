const express = require("express");
const {
  getTopics,
  getArticleById,
} = require("./controllers/news.controllers.js");
const {
  invalidEndpoint,
  handleCustomErrors,
} = require("./controllers/errors.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", invalidEndpoint);
app.use(handleCustomErrors);
module.exports = app;
