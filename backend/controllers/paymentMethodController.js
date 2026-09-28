const PaymentMethod =
  require("../models/paymentMethodModel");

const getBuyerPaymentMethods = (req, res) => {
  const { buyerId } = req.params;

  PaymentMethod.getBuyerPaymentMethods(
    buyerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch payment methods",
        });
      }

      res.json(results);
    }
  );
};

const addPaymentMethod = (req, res) => {
  const { buyerId } = req.params;

  const {
    method_type,
    provider,
    masked_details,
  } = req.body;

  if (!method_type) {
    return res.status(400).json({
      message:
        "Payment method type is required",
    });
  }

  PaymentMethod.addPaymentMethod(
    buyerId,
    method_type,
    provider,
    masked_details,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to add payment method",
        });
      }

      res.status(201).json({
        message:
          "Payment method added successfully",
        paymentMethodId: result.insertId,
      });
    }
  );
};

const updatePaymentMethod = (req, res) => {
  const {
    buyerId,
    paymentId,
  } = req.params;

  const {
    method_type,
    provider,
    masked_details,
  } = req.body;

  if (!method_type) {
    return res.status(400).json({
      message:
        "Payment method type is required",
    });
  }

  PaymentMethod.updatePaymentMethod(
    buyerId,
    paymentId,
    method_type,
    provider,
    masked_details,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to update payment method",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Payment method not found",
        });
      }

      res.json({
        message:
          "Payment method updated successfully",
      });
    }
  );
};

const deletePaymentMethod = (req, res) => {
  const {
    buyerId,
    paymentId,
  } = req.params;

  PaymentMethod.deletePaymentMethod(
    buyerId,
    paymentId,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to delete payment method",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Payment method not found",
        });
      }

      res.json({
        message:
          "Payment method deleted successfully",
      });
    }
  );
};

module.exports = {
  getBuyerPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};