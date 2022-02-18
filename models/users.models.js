const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT username FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchUserByUsername = (username) => {
  if (Number(username)) {
    return Promise.reject({ status: 400, msg: "Invalid username" });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows: [user] }) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return user;
    });
};
