const db = require("../config/db");

const getBuyerAddresses = (buyerId, callback) => {
  const sql = `
    SELECT
      id,
      buyer_id,
      address_line,
      city,
      state,
      postal_code,
      country
    FROM addresses
    WHERE buyer_id = ?
  `;

  db.query(sql, [buyerId], callback);
};

const addAddress = (
  buyerId,
  addressLine,
  city,
  state,
  postalCode,
  country,
  callback
) => {
  const sql = `
    INSERT INTO addresses (
      buyer_id,
      address_line,
      city,
      state,
      postal_code,
      country
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      buyerId,
      addressLine,
      city,
      state,
      postalCode,
      country,
    ],
    callback
  );
};

const updateAddress = (
  buyerId,
  addressId,
  addressLine,
  city,
  state,
  postalCode,
  country,
  callback
) => {
  const sql = `
    UPDATE addresses
    SET
      address_line = ?,
      city = ?,
      state = ?,
      postal_code = ?,
      country = ?
    WHERE id = ?
      AND buyer_id = ?
  `;

  db.query(
    sql,
    [
      addressLine,
      city,
      state,
      postalCode,
      country,
      addressId,
      buyerId,
    ],
    callback
  );
};

const deleteAddress = (
  buyerId,
  addressId,
  callback
) => {
  const sql = `
    DELETE FROM addresses
    WHERE id = ?
      AND buyer_id = ?
  `;

  db.query(
    sql,
    [addressId, buyerId],
    callback
  );
};

module.exports = {
  getBuyerAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};