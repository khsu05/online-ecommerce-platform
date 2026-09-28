const Wishlist =
  require("../models/wishlistModel");

const addToWishlist = (req, res) => {
  const { buyerId, productId } = req.params;

  Wishlist.addToWishlist(
    buyerId,
    productId,
    (err, result) => {
      if (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message:
              "Product already exists in wishlist",
          });
        }

        return res.status(500).json({
          message:
            "Failed to add product to wishlist",
        });
      }

      res.status(201).json({
        message:
          "Product added to wishlist successfully",
      });
    }
  );
};

const getBuyerWishlist = (req, res) => {
  const { buyerId } = req.params;

  Wishlist.getBuyerWishlist(
    buyerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch wishlist",
        });
      }

      res.json(results);
    }
  );
};

const removeFromWishlist = (req, res) => {
  const { buyerId, productId } = req.params;

  Wishlist.removeFromWishlist(
    buyerId,
    productId,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to remove product from wishlist",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Product not found in wishlist",
        });
      }

      res.json({
        message:
          "Product removed from wishlist successfully",
      });
    }
  );
};

module.exports = {
  addToWishlist,
  getBuyerWishlist,
  removeFromWishlist,
};