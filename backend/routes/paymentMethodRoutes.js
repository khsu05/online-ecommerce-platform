const express = require("express");

const router = express.Router();

const {
  getBuyerPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require(
  "../controllers/paymentMethodController"
);

router.get(
  "/buyer/:buyerId",
  getBuyerPaymentMethods
);

router.post(
  "/buyer/:buyerId",
  addPaymentMethod
);

router.put(
  "/buyer/:buyerId/:paymentId",
  updatePaymentMethod
);

router.delete(
  "/buyer/:buyerId/:paymentId",
  deletePaymentMethod
);

module.exports = router;