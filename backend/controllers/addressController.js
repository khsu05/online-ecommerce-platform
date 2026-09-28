const Address =
  require("../models/addressModel");

const getBuyerAddresses = (req, res) => {
  const { buyerId } = req.params;

  Address.getBuyerAddresses(
    buyerId,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to fetch addresses",
        });
      }

      res.json(results);
    }
  );
};

const addAddress = (req, res) => {
  const { buyerId } = req.params;

  const {
    address_line,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  if (
    !address_line ||
    !city ||
    !state ||
    !postal_code ||
    !country
  ) {
    return res.status(400).json({
      message:
        "All address fields are required",
    });
  }

  Address.addAddress(
    buyerId,
    address_line,
    city,
    state,
    postal_code,
    country,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to add address",
        });
      }

      res.status(201).json({
        message:
          "Address added successfully",
        addressId: result.insertId,
      });
    }
  );
};

const updateAddress = (req, res) => {
  const {
    buyerId,
    addressId,
  } = req.params;

  const {
    address_line,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  if (
    !address_line ||
    !city ||
    !state ||
    !postal_code ||
    !country
  ) {
    return res.status(400).json({
      message:
        "All address fields are required",
    });
  }

  Address.updateAddress(
    buyerId,
    addressId,
    address_line,
    city,
    state,
    postal_code,
    country,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to update address",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      res.json({
        message:
          "Address updated successfully",
      });
    }
  );
};

const deleteAddress = (req, res) => {
  const {
    buyerId,
    addressId,
  } = req.params;

  Address.deleteAddress(
    buyerId,
    addressId,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message:
            "Failed to delete address",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      res.json({
        message:
          "Address deleted successfully",
      });
    }
  );
};

module.exports = {
  getBuyerAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};