const BrowsingHistory =
  require("../models/browsingHistoryModel");

const addBrowsingHistory = (req, res) => {
  const { buyerId, productId } = req.params;

  BrowsingHistory.addBrowsingHistory(
    buyerId,
    productId,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to record product view",
        });
      }

      res.status(201).json({
        message:
          "Product view recorded successfully",
      });
    }
  );
};

const getBuyerBrowsingHistory = (
  req,
  res
) => {
  const { buyerId } = req.params;

  BrowsingHistory.getBuyerBrowsingHistory(
    buyerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch browsing history",
        });
      }

      res.json(results);
    }
  );
};

module.exports = {
  addBrowsingHistory,
  getBuyerBrowsingHistory,
}; 