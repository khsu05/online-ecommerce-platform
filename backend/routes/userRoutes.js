const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updatePersonalDetails,
} = require("../controllers/userController");

router.get("/", getUsers);
router.get(
  "/:id/profile",
  getUserById
);

router.post("/", createUser);

router.put(
  "/:id/profile",
  updatePersonalDetails
);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;