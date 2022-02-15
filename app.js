const express = require("express");
const {
  getTopics,
  getArticleById,
  patchArticleById,
} = require("./controllers/news.controllers.js");
const {
  invalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", invalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
