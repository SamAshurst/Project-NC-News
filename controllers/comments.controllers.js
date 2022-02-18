const { deleteCommentById } = require("../models/comments.models");
const { checkCommentExists } = require("../models/utils");

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
