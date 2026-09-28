const express = require("express");

const router = express.Router();

const {
  addBrowsingHistory,
  getBuyerBrowsingHistory,
} = require(
  "../controllers/browsingHistoryController"
);

router.get(
  "/buyer/:buyerId",
  getBuyerBrowsingHistory
);

router.post(
  "/buyer/:buyerId/product/:productId",
  addBrowsingHistory
);

module.exports = router;