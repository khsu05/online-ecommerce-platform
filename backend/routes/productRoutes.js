const express = require("express");

const router = express.Router();

const {
  getProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getSellerInventory,
  browseProducts,
} = require("../controllers/productController");

router.get("/", getProducts);

router.get(
  "/browse",
  browseProducts
);

router.get(
  "/seller/:sellerId",
  getSellerProducts
);

router.get(
  "/seller/:sellerId/inventory",
  getSellerInventory
);

router.post(
  "/seller/:sellerId",
  createProduct
);

router.put(
  "/seller/:sellerId/product/:productId/inventory",
  updateInventory
);

router.put(
  "/:id",
  updateProduct
);

router.delete(
  "/:id",
  deleteProduct
);


module.exports = router;