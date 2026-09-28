const SystemActivity =
  require("../models/systemActivityModel");
const User = require("../models/userModel");

const getUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch users",
      });
    }

    res.json(results);
  });
};

const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Name, email and role are required",
    });
  }
   const validRoles = ["admin", "seller", "buyer"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: "Role must be admin, seller, or buyer",
    });
  }

  User.createUser(name, email, role, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create user",
      });
    }

    SystemActivity.logActivity(
  result.insertId,
  "User account created",
  (activityErr) => {
    if (activityErr) {
      console.error(
        "Activity logging failed:",
        activityErr
      );
    }
  }
);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Name, email and role are required",
    });
  }
   const validRoles = ["admin", "seller", "buyer"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: "Role must be admin, seller, or buyer",
    });
  }

  User.updateUser(id, name, email, role, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update user",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully",
    });
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  User.deleteUser(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete user",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.getUserById(id, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch user details",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(results[0]);
  });
};

const updatePersonalDetails = (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  User.updatePersonalDetails(
    id,
    name,
    email,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to update personal details",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message:
          "Personal details updated successfully",
      });
    }
  );
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updatePersonalDetails,
};