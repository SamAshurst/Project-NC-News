const db = require("../db/connection");

exports.deleteCommentById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Sorry that id does not exist",
        });
      }
    });
};
