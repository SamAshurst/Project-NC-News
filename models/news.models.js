const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchUsers = () => {
  return db.query(`SELECT username FROM users`).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchArticleById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows: article }) => {
      if (!article.length) {
        return Promise.reject({
          status: 400,
          msg: "Sorry that id does not exist",
        });
      }
      return article;
    });
};
