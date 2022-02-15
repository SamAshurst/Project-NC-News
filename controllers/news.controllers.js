const {
  fetchTopics,
  fetchArticleById,
  updateArticleById,
} = require("../models/news.models.js");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;
  updateArticleById(id, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
