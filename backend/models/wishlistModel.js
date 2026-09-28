const db = require("../config/db");

// --------------------------------------------------
// ADD PRODUCT TO WISHLIST
// --------------------------------------------------

const addToWishlist = (
  buyerId,
  productId,
  callback
) => {
  const sql = `
    INSERT INTO wishlist (
      buyer_id,
      product_id,
      price_when_added
    )

    SELECT
      ?,
      products.id,
      products.price

    FROM products

    WHERE products.id = ?
  `;

  db.query(
    sql,
    [buyerId, productId],
    callback
  );
};

// --------------------------------------------------
// GET BUYER WISHLIST
// --------------------------------------------------

const getBuyerWishlist = (
  buyerId,
  callback
) => {
  const sql = `
    SELECT
      wishlist.id,
      wishlist.product_id,

      products.name,
      products.description,
      products.image_url,

      wishlist.price_when_added,

      products.price AS current_price,

      CASE
        WHEN products.price < wishlist.price_when_added
          THEN 'Decreased'

        WHEN products.price > wishlist.price_when_added
          THEN 'Increased'

        ELSE 'No Change'
      END AS price_change

    FROM wishlist

    JOIN products
      ON wishlist.product_id = products.id

    WHERE wishlist.buyer_id = ?

    ORDER BY wishlist.id DESC
  `;

  db.query(
    sql,
    [buyerId],
    callback
  );
};

// --------------------------------------------------
// REMOVE PRODUCT FROM WISHLIST
// --------------------------------------------------

const removeFromWishlist = (
  buyerId,
  productId,
  callback
) => {
  const sql = `
    DELETE FROM wishlist

    WHERE buyer_id = ?
      AND product_id = ?
  `;

  db.query(
    sql,
    [buyerId, productId],
    callback
  );
};

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
  addToWishlist,
  getBuyerWishlist,
  removeFromWishlist,
};