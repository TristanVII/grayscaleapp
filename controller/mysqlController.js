const mysql = require("mysql");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "newuser",
  password: "password",
  database: "lab7",
});

connection.connect();

async function authenticateUser(username, password) {
  const query = `SELECT * FROM users WHERE username = ?`;

  console.log("mysql: ", username, password);

  const userRows = await new Promise((resolve, reject) => {
    connection.query(query, [username], function (error, results, fields) {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

  if (userRows.length === 0) {
    return false;
  }

  const user = userRows[0];
  console.log("user: ", user);

  if (bcrypt.compareSync(password, user.password)) {
    console.log("TRUE");
    return user;
  } else {
    false;
  }
}

function createUser(username, password, callback) {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

  connection.query(query, [username, hash], function (error, results, fields) {
    if (error) {
      return false;
    }

    return true;
  });
}

function getUserById(userId, callback) {
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error selecting user:", error);
        return callback(error, null);
      }

      if (results.length === 0) {
        console.log("User not found");
        return callback(null, null);
      }

      const user = results[0];
      return callback(null, user);
    }
  );
}

module.exports = {
  authenticateUser,
  createUser,
  getUserById,
};
