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

exports.updateCommentById = (id, votes) => {
  return db
    .query(
      `UPDATE comments 
    SET votes = votes + $1 
    WHERE comment_id = $2 
    RETURNING *;`,
      [votes, id]
    )
    .then(({ rows: [comment] }) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Sorry that id does not exist",
        });
      }
      return comment;
    });
};
