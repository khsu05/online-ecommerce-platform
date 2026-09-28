const SystemActivity =
  require("../models/systemActivityModel");

const getActivities = (req, res) => {
  SystemActivity.getAllActivities(
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch system activities",
        });
      }

      res.json(results);
    }
  );
};

module.exports = {
  getActivities,
};