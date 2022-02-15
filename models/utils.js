exports.articleIdChecker = (article) => {
  if (!article) {
    return Promise.reject({
      status: 404,
      msg: "Sorry that id does not exist",
    });
  }
  return article;
};
