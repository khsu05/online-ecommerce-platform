const db = require("../config/db");

const getBuyerPaymentMethods = (buyerId, callback) => {
  const sql = `
    SELECT
      id,
      buyer_id,
      method_type,
      provider,
      masked_details
    FROM payment_methods
    WHERE buyer_id = ?
  `;

  db.query(sql, [buyerId], callback);
};

const addPaymentMethod = (
  buyerId,
  methodType,
  provider,
  maskedDetails,
  callback
) => {
  const sql = `
    INSERT INTO payment_methods (
      buyer_id,
      method_type,
      provider,
      masked_details
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      buyerId,
      methodType,
      provider,
      maskedDetails,
    ],
    callback
  );
};

const updatePaymentMethod = (
  buyerId,
  paymentId,
  methodType,
  provider,
  maskedDetails,
  callback
) => {
  const sql = `
    UPDATE payment_methods
    SET
      method_type = ?,
      provider = ?,
      masked_details = ?
    WHERE id = ?
      AND buyer_id = ?
  `;

  db.query(
    sql,
    [
      methodType,
      provider,
      maskedDetails,
      paymentId,
      buyerId,
    ],
    callback
  );
};

const deletePaymentMethod = (
  buyerId,
  paymentId,
  callback
) => {
  const sql = `
    DELETE FROM payment_methods
    WHERE id = ?
      AND buyer_id = ?
  `;

  db.query(
    sql,
    [paymentId, buyerId],
    callback
  );
};

module.exports = {
  getBuyerPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};