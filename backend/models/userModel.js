const db = require("../config/db");

const getAllUsers = (callback) => {
  const sql = `
    SELECT id, name, email, role
    FROM users
  `;

  db.query(sql, callback);
};

const createUser = (name, email, role, callback) => {
  const sql = `
    INSERT INTO users (name, email, role)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, role], callback);
};

const updateUser = (id, name, email, role, callback) => {
  const sql = `
    UPDATE users
    SET name = ?, email = ?, role = ?
    WHERE id = ?
  `;

  db.query(sql, [name, email, role, id], callback);
};

const deleteUser = (id, callback) => {
  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
};
const getUserById = (id, callback) => {
  const sql = `
    SELECT id, name, email, role
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
};

const updatePersonalDetails = (
  id,
  name,
  email,
  callback
) => {
  const sql = `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, email, id],
    callback
  );
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updatePersonalDetails,
};