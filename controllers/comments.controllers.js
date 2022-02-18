const { deleteCommentById } = require("../models/comments.models");

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
