const SystemActivity =
  require("../models/systemActivityModel");
const Product = require("../models/productModel");

const getProducts = (req, res) => {
  Product.getAllProducts((err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch products",
      });
    }

    res.json(results);
  });
};

const getSellerProducts = (req, res) => {
  const { sellerId } = req.params;

  Product.getProductsBySeller(
    sellerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to fetch seller products",
        });
      }

      res.json(results);
    }
  );
};

const createProduct = (req, res) => {
  const { sellerId } = req.params;

  const {
    name,
    description,
    price,
  } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      message:
        "Name, description and price are required",
    });
  }

  if (Number(price) < 0) {
    return res.status(400).json({
      message: "Price cannot be negative",
    });
  }

  Product.createProduct(
    sellerId,
    name,
    description,
    price,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to create product",
        });
      }

      SystemActivity.logActivity(
  sellerId,
  "Product listed",
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
        message: "Product listed successfully",
        productId: result.insertId,
      });
    }
  );
};

const updateProduct = (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    price,
  } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      message:
        "Name, description and price are required",
    });
  }

  if (Number(price) < 0) {
    return res.status(400).json({
      message: "Price cannot be negative",
    });
  }

  Product.updateProduct(
    id,
    name,
    description,
    price,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update product",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    }
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.deleteProduct(id, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete product",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  });
};
const updateInventory = (req, res) => {
  const { sellerId, productId } = req.params;
  const { inventory_quantity } = req.body;

  if (inventory_quantity === undefined) {
    return res.status(400).json({
      message: "Inventory quantity is required",
    });
  }

  if (
    !Number.isInteger(Number(inventory_quantity)) ||
    Number(inventory_quantity) < 0
  ) {
    return res.status(400).json({
      message:
        "Inventory quantity must be a non-negative integer",
    });
  }

  Product.updateInventory(
    sellerId,
    productId,
    inventory_quantity,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update inventory",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found for this seller",
        });
      }

      res.json({
        message: "Inventory updated successfully",
      });
    }
  );
};

const getSellerInventory = (req, res) => {
  const { sellerId } = req.params;

  Product.getSellerInventory(
    sellerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to fetch inventory",
        });
      }

      res.json(results);
    }
  );
};

const browseProducts = (req, res) => {
  const {
    search,
    minPrice,
    maxPrice,
  } = req.query;

  Product.browseProducts(
    search,
    minPrice,
    maxPrice,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to fetch products",
        });
      }

      res.json(results);
    }
  );
};

module.exports = {
  getProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getSellerInventory,
   browseProducts,
};