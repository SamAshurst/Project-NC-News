exports.articleIdChecker = (article) => {
  if (!article.length) {
    return Promise.reject({
      status: 404,
      msg: "Sorry that id does not exist",
    });
  }
  return article;
};
