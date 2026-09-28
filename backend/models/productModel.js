const db = require("../config/db");

const getAllProducts = (callback) => {
  const sql = `
    SELECT
      products.id,
      products.seller_id,
      products.name,
      products.description,
      products.price,
      products.inventory_quantity,
      products.image_url
    FROM products
  `;

  db.query(sql, callback);
};

const getProductsBySeller = (sellerId, callback) => {
  const sql = `
    SELECT
      id,
      seller_id,
      name,
      description,
      price,
      inventory_quantity,
      image_url

    FROM products
    WHERE seller_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [sellerId], callback);
};

const createProduct = (
  sellerId,
  name,
  description,
  price,
  callback
) => {
  const sql = `
    INSERT INTO products (
      seller_id,
      name,
      description,
      price
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [sellerId, name, description, price],
    callback
  );
};

const updateProduct = (
  id,
  name,
  description,
  price,
  callback
) => {
  const sql = `
    UPDATE products
    SET
      name = ?,
      description = ?,
      price = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, description, price, id],
    callback
  );
};

const deleteProduct = (id, callback) => {
  const sql = `
    DELETE FROM products
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
};
const updateInventory = (
  sellerId,
  productId,
  inventoryQuantity,
  callback
) => {
  const sql = `
    UPDATE products
    SET inventory_quantity = ?
    WHERE id = ? AND seller_id = ?
  `;

  db.query(
    sql,
    [inventoryQuantity, productId, sellerId],
    callback
  );
};

const getSellerInventory = (sellerId, callback) => {
  const sql = `
    SELECT
      id,
      name,
      inventory_quantity
    FROM products
    WHERE seller_id = ?
  `;

  db.query(sql, [sellerId], callback);
};

const browseProducts = (
  search,
  minPrice,
  maxPrice,
  callback
) => {
  let sql = `
   SELECT
  id,
  seller_id,
  name,
  description,
  price,
  inventory_quantity,
  image_url
FROM products
    WHERE 1 = 1
  `;

  const params = [];

  if (search) {
    sql += `
      AND (
        name LIKE ?
        OR description LIKE ?
      )
    `;

    const searchValue = `%${search}%`;

    params.push(
      searchValue,
      searchValue
    );
  }

  if (minPrice !== undefined) {
    sql += ` AND price >= ?`;
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    sql += ` AND price <= ?`;
    params.push(maxPrice);
  }

  db.query(sql, params, callback);
};

module.exports = {
  getAllProducts,
  getProductsBySeller,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getSellerInventory,
  browseProducts,
};