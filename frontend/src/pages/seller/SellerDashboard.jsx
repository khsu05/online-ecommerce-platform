import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Package,
  ClipboardList,
  Boxes,
  ChartNoAxesCombined,
  ArrowRight,
  Store,
  IndianRupee,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";

import { SELLER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function SellerDashboard() {
  const sellerId = SELLER_ID;

  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [salesSummary, setSalesSummary] = useState({
    total_orders: 0,
    total_units_sold: 0,
    total_sales: 0,
  });

  const [message, setMessage] = useState("");

  // =====================================================
  // API URLS
  // =====================================================

  const PRODUCT_API =
    `http://localhost:5000/api/products/seller/${sellerId}`;

  const ORDER_API =
    `http://localhost:5000/api/orders/seller/${sellerId}`;

  const INVENTORY_API =
    `http://localhost:5000/api/seller-dashboard/${sellerId}/inventory-overview`;

  const SALES_API =
    `http://localhost:5000/api/seller-dashboard/${sellerId}/sales-performance`;

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      const [
        productResponse,
        orderResponse,
        inventoryResponse,
        salesResponse,
      ] = await Promise.all([
        fetch(PRODUCT_API),
        fetch(ORDER_API),
        fetch(INVENTORY_API),
        fetch(SALES_API),
      ]);

      const [
        productData,
        orderData,
        inventoryData,
        salesData,
      ] = await Promise.all([
        productResponse.json(),
        orderResponse.json(),
        inventoryResponse.json(),
        salesResponse.json(),
      ]);

      if (
        !productResponse.ok ||
        !orderResponse.ok ||
        !inventoryResponse.ok ||
        !salesResponse.ok
      ) {
        setMessage(
          "Failed to load some seller dashboard information"
        );

        return;
      }

      setProducts(productData || []);
      setOrders(orderData || []);
      setInventory(inventoryData || []);

      setSalesSummary(
        salesData.summary || {
          total_orders: 0,
          total_units_sold: 0,
          total_sales: 0,
        }
      );

      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load seller dashboard"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // DASHBOARD VALUES
  // =====================================================

  const lowStockCount =
    inventory.filter(
      (item) =>
        item.stock_status === "Low Stock"
    ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="seller"
      title="Seller Dashboard"
      subtitle="Manage your products, orders, inventory, and sales."
    >
      <div className="professional-dashboard seller-dashboard-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            WELCOME
        ========================================== */}

        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              Seller Portal
            </span>

            <h2>
              Manage your store from one place
            </h2>

            <p>
              List products, process customer
              orders, monitor inventory, and
              review your sales performance.
            </p>

            <Link
              to="/seller/products"
              className="dashboard-main-action"
            >
              <Package size={18} />

              Manage Products

              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="welcome-visual">
            <Store size={70} />
          </div>
        </section>

        {/* ==========================================
            SELLER SUMMARY
        ========================================== */}

        <div className="seller-dashboard-summary">
          {/* PRODUCTS */}

          <Link
            to="/seller/products"
            className="seller-dashboard-stat-card"
          >
            <div className="seller-dashboard-stat-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                Products
              </span>

              <strong>
                {products.length}
              </strong>
            </div>
          </Link>

          {/* ORDERS */}

          <Link
            to="/seller/orders"
            className="seller-dashboard-stat-card"
          >
            <div className="seller-dashboard-stat-icon">
              <ShoppingBag size={21} />
            </div>

            <div>
              <span>
                Orders
              </span>

              <strong>
                {orders.length}
              </strong>
            </div>
          </Link>

          {/* LOW STOCK */}

          <Link
            to="/seller/inventory"
            className="seller-dashboard-stat-card"
          >
            <div className="seller-dashboard-stat-icon">
              <AlertTriangle size={21} />
            </div>

            <div>
              <span>
                Low Stock Alerts
              </span>

              <strong>
                {lowStockCount}
              </strong>
            </div>
          </Link>

          {/* SALES */}

          <Link
            to="/seller/sales"
            className="seller-dashboard-stat-card"
          >
            <div className="seller-dashboard-stat-icon">
              <IndianRupee size={21} />
            </div>

            <div>
              <span>
                Total Sales
              </span>

              <strong className="seller-dashboard-sales-value">
                ₹
                {formatPrice(
                  salesSummary.total_sales
                )}
              </strong>
            </div>
          </Link>
        </div>

        {/* ==========================================
            MANAGEMENT HEADING
        ========================================== */}

        <div className="dashboard-content-heading">
          <div>
            <h2>
              Store Management
            </h2>

            <p>
              Access the main tools for managing
              your seller activity.
            </p>
          </div>
        </div>

        {/* ==========================================
            MANAGEMENT CARDS
        ========================================== */}

        <div className="professional-card-grid">
          {/* PRODUCTS */}

          <Link
            to="/seller/products"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <Package size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                Product Listings
              </h3>

              <p>
                View, edit, and manage your
                listed products and stock
                quantities.
              </p>
            </div>

            <div className="professional-card-footer">
              Manage Products

              <ArrowRight size={17} />
            </div>
          </Link>

          {/* ORDERS */}

          <Link
            to="/seller/orders"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <ClipboardList size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                Order Management
              </h3>

              <p>
                View customer orders and update
                their processing and fulfillment
                status.
              </p>
            </div>

            <div className="professional-card-footer">
              View Orders

              <ArrowRight size={17} />
            </div>
          </Link>

          {/* INVENTORY */}

          <Link
            to="/seller/inventory"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <Boxes size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                Inventory Overview
              </h3>

              <p>
                Monitor product inventory levels
                and identify low-stock products.
              </p>
            </div>

            <div className="professional-card-footer">
              View Inventory

              <ArrowRight size={17} />
            </div>
          </Link>

          {/* SALES */}

          <Link
            to="/seller/sales"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <ChartNoAxesCombined
                size={24}
              />
            </div>

            <div className="professional-card-text">
              <h3>
                Sales Performance
              </h3>

              <p>
                Review sales totals, units sold,
                orders, and sales trends.
              </p>
            </div>

            <div className="professional-card-footer">
              View Performance

              <ArrowRight size={17} />
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default SellerDashboard;