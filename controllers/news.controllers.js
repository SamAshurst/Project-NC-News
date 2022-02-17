const {
  fetchTopics,
  fetchUsers,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
  deleteCommentById,
} = require("../models/news.models.js");
const { checkArticleExists, checkCommentExists } = require("../models/utils");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
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

exports.removeCommentById = (req, res, next) => {
  const id = req.params.comment_id;

  Promise.all([checkCommentExists(id), deleteCommentById(id)])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
