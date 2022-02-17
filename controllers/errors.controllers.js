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
  const psqlSortByCode = ["42703"];
  const psqlOrderCode = ["42601"];
  const psqlUnauthorised = ["23503"];

  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (psqlSortByCode.includes(err.code)) {
    res.status(400).send({ msg: "Invalid sort query" });
  } else if (psqlOrderCode.includes(err.code)) {
    res.status(400).send({ msg: "Invalid order query" });
  } else if (psqlUnauthorised.includes(err.code)) {
    res.status(401).send({ msg: "Unauthorised user" });
  } else next(err);
};
