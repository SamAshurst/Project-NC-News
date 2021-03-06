const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateArticleById,
  insertCommentByArticleId,
} = require("../models/articles.models");
const {
  checkTopicExists,
  checkQueryIsValid,
  checkArticleExists,
} = require("../models/utils");

exports.getArticles = (req, res, next) => {
  const query = req.query;
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;

  Promise.all([
    fetchArticles(sortBy, order, topic),
    checkTopicExists(topic),
    checkQueryIsValid(query),
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  Promise.all([fetchArticleById(id), checkArticleExists(id)])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;

  Promise.all([fetchCommentsByArticleId(id), checkArticleExists(id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;

  Promise.all([updateArticleById(id, votes), checkArticleExists(id)])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const username = req.body.username;
  const commentBody = req.body.body;

  insertCommentByArticleId(id, username, commentBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
