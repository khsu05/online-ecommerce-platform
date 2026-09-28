const express = require("express");

const router = express.Router();

const {
  getBuyerAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require(
  "../controllers/addressController"
);

router.get(
  "/buyer/:buyerId",
  getBuyerAddresses
);

router.post(
  "/buyer/:buyerId",
  addAddress
);

router.put(
  "/buyer/:buyerId/:addressId",
  updateAddress
);

router.delete(
  "/buyer/:buyerId/:addressId",
  deleteAddress
);

module.exports = router;