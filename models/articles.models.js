const db = require("../db/connection");

exports.fetchArticles = (sortBy = "created_at", order = "DESC", topic) => {
  let queryStr = `SELECT
    articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.created_at, 
    articles.votes,
    COUNT(comments.article_id)::int AS comment_count 
   FROM articles
   LEFT JOIN comments ON comments.article_id = articles.article_id `;

  const values = [];
  if (topic) {
    queryStr += `WHERE articles.topic = $1 `;
    values.push(topic);
  }

  queryStr += `GROUP BY articles.article_id
   ORDER BY ${sortBy} ${order};`;

  return db.query(queryStr, values).then(({ rows: articles }) => {
    return articles;
  });
};

exports.fetchArticleById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  }
  return db
    .query(
      `SELECT articles.*, 
        COUNT(comments.article_id)::int AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows: [article] }) => {
      return article;
    });
};

exports.fetchCommentsByArticleId = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  }
  return db
    .query(
      `SELECT comment_id, 
        body, 
        votes, 
        author, 
        created_at 
        FROM comments 
        WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.updateArticleById = (id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then(({ rows: [article] }) => {
      return article;
    });
};

exports.insertCommentByArticleId = (id, username, commentBody) => {
  if (typeof commentBody !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `INSERT INTO comments
        (article_id, author, body)
        VALUES
        ($1, $2, $3)
        RETURNING *;`,
      [id, username, commentBody]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};
