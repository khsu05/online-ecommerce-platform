const db = require("../config/db");

// Get all orders - Admin
const getAllOrders = (callback) => {
  const sql = `
    SELECT
      orders.id,
      orders.buyer_id,
      users.name AS buyer_name,
      orders.total_amount,
      orders.status,
      orders.created_at
    FROM orders
    JOIN users
      ON orders.buyer_id = users.id
    ORDER BY orders.created_at DESC
  `;

  db.query(sql, callback);
};

// Get orders for a buyer
const getBuyerOrders = (buyerId, callback) => {
  const sql = `
    SELECT
      id,
      buyer_id,
      total_amount,
      status,
      created_at
    FROM orders
    WHERE buyer_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [buyerId], callback);
};

// Get orders containing products from a seller
const getSellerOrders = (sellerId, callback) => {
  const sql = `
    SELECT DISTINCT
      orders.id,
      orders.buyer_id,
      orders.total_amount,
      orders.status,
      orders.created_at
    FROM orders
    JOIN order_items
      ON orders.id = order_items.order_id
    JOIN products
      ON order_items.product_id = products.id
    WHERE products.seller_id = ?
    ORDER BY orders.created_at DESC
  `;

  db.query(sql, [sellerId], callback);
};

// Get order items
const getOrderItems = (orderId, callback) => {
  const sql = `
    SELECT
      order_items.id,
      order_items.product_id,
      products.name,
      order_items.quantity,
      order_items.price
    FROM order_items
    JOIN products
      ON order_items.product_id = products.id
    WHERE order_items.order_id = ?
  `;

  db.query(sql, [orderId], callback);
};

// Update order status
const updateOrderStatus = (
  orderId,
  status,
  callback
) => {
  const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [status, orderId],
    callback
  );
};
const createOrder = (
  buyerId,
  items,
  callback
) => {
  db.beginTransaction((err) => {
    if (err) {
      return callback(err);
    }

    const productIds = items.map(
      (item) => item.product_id
    );

    const placeholders =
      productIds.map(() => "?").join(",");

    const productSql = `
      SELECT id, price, inventory_quantity
      FROM products
      WHERE id IN (${placeholders})
    `;

    db.query(
      productSql,
      productIds,
      (err, products) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }

        if (
          products.length !==
          productIds.length
        ) {
          return db.rollback(() => {
            callback(
              new Error(
                "One or more products were not found"
              )
            );
          });
        }

        let totalAmount = 0;

        for (const item of items) {
          const product =
            products.find(
              (p) =>
                p.id ===
                Number(item.product_id)
            );

          if (
            !Number.isInteger(
              Number(item.quantity)
            ) ||
            Number(item.quantity) <= 0
          ) {
            return db.rollback(() => {
              callback(
                new Error(
                  "Product quantity must be greater than 0"
                )
              );
            });
          }

          if (
            product.inventory_quantity <
            item.quantity
          ) {
            return db.rollback(() => {
              callback(
                new Error(
                  `Insufficient inventory for product ${product.id}`
                )
              );
            });
          }

          totalAmount +=
            Number(product.price) *
            Number(item.quantity);
        }

        const orderSql = `
          INSERT INTO orders (
            buyer_id,
            total_amount,
            status
          )
          VALUES (?, ?, 'Pending')
        `;

        db.query(
          orderSql,
          [buyerId, totalAmount],
          (err, orderResult) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }

            const orderId =
              orderResult.insertId;

            const orderItemValues =
              items.map((item) => {
                const product =
                  products.find(
                    (p) =>
                      p.id ===
                      Number(
                        item.product_id
                      )
                  );

                return [
                  orderId,
                  item.product_id,
                  item.quantity,
                  product.price,
                ];
              });

            const itemsSql = `
              INSERT INTO order_items
                (
                  order_id,
                  product_id,
                  quantity,
                  price
                )
              VALUES ?
            `;

            db.query(
              itemsSql,
              [orderItemValues],
              (err) => {
                if (err) {
                  return db.rollback(
                    () => {
                      callback(err);
                    }
                  );
                }

                let completed = 0;
                let failed = false;

                items.forEach((item) => {
                  const inventorySql = `
                    UPDATE products
                    SET inventory_quantity =
                      inventory_quantity - ?
                    WHERE id = ?
                  `;

                  db.query(
                    inventorySql,
                    [
                      item.quantity,
                      item.product_id,
                    ],
                    (err) => {
                      if (
                        err &&
                        !failed
                      ) {
                        failed = true;

                        return db.rollback(
                          () => {
                            callback(err);
                          }
                        );
                      }

                      completed++;

                      if (
                        completed ===
                          items.length &&
                        !failed
                      ) {
                        db.commit(
                          (err) => {
                            if (err) {
                              return db.rollback(
                                () => {
                                  callback(
                                    err
                                  );
                                }
                              );
                            }

                            callback(
                              null,
                              {
                                orderId,
                                totalAmount,
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                });
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  getAllOrders,
  getBuyerOrders,
  getSellerOrders,
  getOrderItems,
  updateOrderStatus,
  createOrder,
};