exports.articleChecker = (article) => {
  if (!article.length) {
    return Promise.reject({
      status: 400,
      msg: "Sorry that id does not exist",
    });
  }
  return article;
};
