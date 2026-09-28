const express = require("express");

const router = express.Router();

const {
  getActivities,
} = require(
  "../controllers/systemActivityController"
);

router.get(
  "/",
  getActivities
);

module.exports = router;