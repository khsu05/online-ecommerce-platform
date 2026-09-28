const db = require("../config/db");

const addBrowsingHistory = (
  buyerId,
  productId,
  callback
) => {
  const sql = `
    INSERT INTO browsing_history (
      buyer_id,
      product_id
    )
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [buyerId, productId],
    callback
  );
};

const getBuyerBrowsingHistory = (
  buyerId,
  callback
) => {
  const sql = `
    SELECT
      browsing_history.id,
      browsing_history.product_id,

      products.name,
      products.description,
      products.price,
      products.image_url,
      products.inventory_quantity,

      browsing_history.viewed_at

    FROM browsing_history

    JOIN products
      ON browsing_history.product_id = products.id

    WHERE browsing_history.buyer_id = ?

    ORDER BY browsing_history.viewed_at DESC
  `;

  db.query(
    sql,
    [buyerId],
    callback
  );
};

module.exports = {
  addBrowsingHistory,
  getBuyerBrowsingHistory,
};