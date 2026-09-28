const db = require("../config/db");

const getSalesSummary = (sellerId, callback) => {
  const sql = `
    SELECT
      COUNT(DISTINCT orders.id) AS total_orders,
      COALESCE(SUM(order_items.quantity), 0) AS total_units_sold,
      COALESCE(
        SUM(order_items.quantity * order_items.price),
        0
      ) AS total_sales
    FROM order_items
    JOIN orders
      ON order_items.order_id = orders.id
    JOIN products
      ON order_items.product_id = products.id
    WHERE products.seller_id = ?
  `;

  db.query(sql, [sellerId], callback);
};

const getSalesTrend = (sellerId, callback) => {
  const sql = `
    SELECT
      DATE(orders.created_at) AS sale_date,
      COUNT(DISTINCT orders.id) AS total_orders,
      SUM(order_items.quantity) AS units_sold,
      SUM(
        order_items.quantity * order_items.price
      ) AS sales_amount
    FROM order_items
    JOIN orders
      ON order_items.order_id = orders.id
    JOIN products
      ON order_items.product_id = products.id
    WHERE products.seller_id = ?
    GROUP BY DATE(orders.created_at)
    ORDER BY sale_date ASC
  `;

  db.query(sql, [sellerId], callback);
};

const getInventoryOverview = (sellerId, callback) => {
  const sql = `
    SELECT
      id AS product_id,
      name AS product_name,
      inventory_quantity,

      CASE
        WHEN inventory_quantity <= 5
          THEN 'Low Stock'
        ELSE 'In Stock'
      END AS stock_status

    FROM products
    WHERE seller_id = ?
    ORDER BY inventory_quantity ASC
  `;

  db.query(sql, [sellerId], callback);
};

module.exports = {
  getSalesSummary,
  getSalesTrend,
  getInventoryOverview,
};