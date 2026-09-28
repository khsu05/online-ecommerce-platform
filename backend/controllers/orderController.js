const SystemActivity =
  require("../models/systemActivityModel");
const Order = require("../models/orderModel");

const getOrders = (req, res) => {
  Order.getAllOrders(
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch orders",
        });
      }

      res.json(results);
    }
  );
};

const getBuyerOrders = (
  req,
  res
) => {
  const { buyerId } = req.params;

  Order.getBuyerOrders(
    buyerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch buyer orders",
        });
      }

      res.json(results);
    }
  );
};

const getSellerOrders = (
  req,
  res
) => {
  const { sellerId } = req.params;

  Order.getSellerOrders(
    sellerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch seller orders",
        });
      }

      res.json(results);
    }
  );
};

const getOrderItems = (
  req,
  res
) => {
  const { orderId } = req.params;

  Order.getOrderItems(
    orderId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch order details",
        });
      }

      res.json(results);
    }
  );
};



const createOrder = (
  req,
  res
) => {
  const { buyerId } = req.params;
  const { items } = req.body;

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message:
        "Selected products are required",
    });
  }

  SystemActivity.logActivity(
  buyerId,
  "Order placed",
  (activityErr) => {
    if (activityErr) {
      console.error(
        "Activity logging failed:",
        activityErr
      );
    }
  }
);

  Order.createOrder(
    buyerId,
    items,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(400).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message:
          "Order placed successfully",
        orderId: result.orderId,
        totalAmount:
          result.totalAmount,
      });
    }
  );
};

const updateOrderStatus = (
  req,
  res
) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message:
        "Order status is required",
    });
  }

  Order.updateOrderStatus(
    orderId,
    status,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to update order status",
        });
      }

      if (
        result.affectedRows === 0
      ) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      res.json({
        message:
          "Order status updated successfully",
      });
    }
  );
};

module.exports = {
  getOrders,
  getBuyerOrders,
  getSellerOrders,
  getOrderItems,
  createOrder,
  updateOrderStatus,
};