const express = require("express");

const router = express.Router();

const {
  getOrders,
  getBuyerOrders,
  getSellerOrders,
  getOrderItems,
  createOrder,
  updateOrderStatus,
} = require(
  "../controllers/orderController"
);

router.get(
  "/",
  getOrders
);

router.get(
  "/buyer/:buyerId",
  getBuyerOrders
);

router.get(
  "/seller/:sellerId",
  getSellerOrders
);

router.get(
  "/:orderId/items",
  getOrderItems
);

router.post(
  "/buyer/:buyerId",
  createOrder
);

router.put(
  "/:orderId/status",
  updateOrderStatus
);

module.exports = router;