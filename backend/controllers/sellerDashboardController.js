const SellerDashboard =
  require("../models/sellerDashboardModel");

const getSalesPerformance = (req, res) => {
  const { sellerId } = req.params;

  SellerDashboard.getSalesSummary(
    sellerId,
    (err, summaryResults) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch sales summary",
        });
      }

      SellerDashboard.getSalesTrend(
        sellerId,
        (err, trendResults) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message:
                "Failed to fetch sales trend",
            });
          }

          res.json({
            summary: summaryResults[0],
            trend: trendResults,
          });
        }
      );
    }
  );
};

const getInventoryOverview = (req, res) => {
  const { sellerId } = req.params;

  SellerDashboard.getInventoryOverview(
    sellerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch inventory overview",
        });
      }

      res.json(results);
    }
  );
};

module.exports = {
  getSalesPerformance,
  getInventoryOverview,
};