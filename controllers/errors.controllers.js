exports.invalidEndpoint = (req, res) => {
  res
    .status(404)
    .send({ msg: "Oh no! The path you are looking for does not exist!" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
