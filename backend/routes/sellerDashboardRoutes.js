const express = require("express");

const router = express.Router();

const {
  getSalesPerformance,
  getInventoryOverview,
} = require(
  "../controllers/sellerDashboardController"
);

router.get(
  "/:sellerId/sales-performance",
  getSalesPerformance
);

router.get(
  "/:sellerId/inventory-overview",
  getInventoryOverview
);

module.exports = router;