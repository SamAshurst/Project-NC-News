const db = require("../db/connection");

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

exports.checkTopicExists = (topic) => {
  if (!topic) {
    return Promise.resolve;
  }
  return db
    .query(`SELECT slug FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows: [slug] }) => {
      if (!slug) {
        return Promise.reject({
          status: 404,
          msg: "Sorry that topic does not exist",
        });
      }
    });
};

exports.checkQueryIsValid = (query) => {
  const validQueries = ["sort_by", "order", "topic"];

  for (const key in query) {
    if (!validQueries.includes(key)) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
      });
    }
  }
};
