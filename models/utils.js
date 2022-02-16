const db = require("../db/connection.js");

exports.articleIdChecker = (article) => {
  if (!article) {
    return Promise.reject({
      status: 404,
      msg: "Sorry that id does not exist",
    });
  }
  return article;
};

exports.checkArticleExists = (id) => {
  return db
    .query(`SELECT article_id FROM articles WHERE article_id = $1`, [id])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Sorry that id does not exist",
        });
      }
    });
};
