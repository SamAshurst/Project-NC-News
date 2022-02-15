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

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["23502", "22P02"];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};
