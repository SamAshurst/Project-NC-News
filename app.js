const express = require("express");
const {
  getTopics,
  getArticleById,
  getUsers,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  removeCommentById,
} = require("./controllers/news.controllers.js");

const {
  invalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", removeCommentById);

app.all("/*", invalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
