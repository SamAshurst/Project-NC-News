const express = require("express");
const apiRouter = require("./routes/api-router");

const {
  invalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

// app.get("/api/topics", getTopics);
// app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
// app.get("/api/articles/:article_id", getArticleById);
// app.get("/api/articles", getArticles);
//app.get("/api/users", getUsers);
// app.get("/api", getEndpoints);

// app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", invalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
