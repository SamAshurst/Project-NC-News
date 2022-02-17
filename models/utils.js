const db = require("../db/connection.js");

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

exports.checkCommentExists = (id) => {
  return db
    .query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [id])
    .then(({ rows: [comment] }) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Sorry that id does not exist",
        });
      }
    });
};
