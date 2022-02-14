exports.invalidEndpoint = (req, res) => {
  res
    .status(404)
    .send({ msg: "Oh no! The path you are looking for does not exist!" });
};
