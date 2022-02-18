const {
  deleteCommentById,
  updateCommentById,
} = require("../models/comments.models");

exports.removeCommentById = (req, res, next) => {
  const id = req.params.comment_id;

  deleteCommentById(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  const votes = req.body.inc_votes;

  updateCommentById(id, votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
