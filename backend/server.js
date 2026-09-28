const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const db = require("./config/db");

const userRoutes =
  require("./routes/userRoutes");

  const orderRoutes =
  require("./routes/orderRoutes");

const productRoutes =
  require("./routes/productRoutes");

  const browsingHistoryRoutes =
  require("./routes/browsingHistoryRoutes");

  const wishlistRoutes =
  require("./routes/wishlistRoutes");

  const addressRoutes =
  require("./routes/addressRoutes");

  const paymentMethodRoutes =
  require("./routes/paymentMethodRoutes");

  const systemActivityRoutes =
  require("./routes/systemActivityRoutes");

  const sellerDashboardRoutes =
  require("./routes/sellerDashboardRoutes");

const app = express();

const PORT = 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "Online E-commerce Platform API is running",
  });
});

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/browsing-history",
  browsingHistoryRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/addresses",
  addressRoutes
);

app.use(
  "/api/payment-methods",
  paymentMethodRoutes
);

app.use(
  "/api/system-activities",
  systemActivityRoutes
);

app.use(
  "/api/seller-dashboard",
  sellerDashboardRoutes
);

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});