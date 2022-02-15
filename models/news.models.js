const db = require("../db/connection");
const { articleIdChecker } = require("./utils.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows: article }) => {
      return articleIdChecker(article);
    });
};

exports.updateArticleById = (id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then(({ rows: article }) => {
      return articleIdChecker(article);
    });
};
