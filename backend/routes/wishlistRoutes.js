const express = require("express");

const router = express.Router();

const {
  addToWishlist,
  getBuyerWishlist,
  removeFromWishlist,
} = require(
  "../controllers/wishlistController"
);

router.get(
  "/buyer/:buyerId",
  getBuyerWishlist
);

router.post(
  "/buyer/:buyerId/product/:productId",
  addToWishlist
);

router.delete(
  "/buyer/:buyerId/product/:productId",
  removeFromWishlist
);

module.exports = router;