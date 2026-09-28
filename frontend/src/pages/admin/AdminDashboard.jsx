import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Users,
  Package,
  ClipboardList,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

function AdminDashboard() {
  // =====================================================
  // STATE
  // =====================================================

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);

  const [message, setMessage] = useState("");

  // =====================================================
  // API URLS
  // =====================================================

  const USER_API =
    "http://localhost:5000/api/users";

  const PRODUCT_API =
    "http://localhost:5000/api/products";

  const ORDER_API =
    "http://localhost:5000/api/orders";

  const ACTIVITY_API =
    "http://localhost:5000/api/system-activities";

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      const [
        userResponse,
        productResponse,
        orderResponse,
        activityResponse,
      ] = await Promise.all([
        fetch(USER_API),
        fetch(PRODUCT_API),
        fetch(ORDER_API),
        fetch(ACTIVITY_API),
      ]);

      const [
        userData,
        productData,
        orderData,
        activityData,
      ] = await Promise.all([
        userResponse.json(),
        productResponse.json(),
        orderResponse.json(),
        activityResponse.json(),
      ]);

      if (
        !userResponse.ok ||
        !productResponse.ok ||
        !orderResponse.ok ||
        !activityResponse.ok
      ) {
        setMessage(
          "Failed to load some admin dashboard information"
        );

        return;
      }

      setUsers(userData || []);
      setProducts(productData || []);
      setOrders(orderData || []);
      setActivities(activityData || []);

      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load admin dashboard"
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
  // UI
  // =====================================================

  return (
    <AppLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Manage users, products, orders, and system activity."
    >
      <div className="professional-dashboard admin-dashboard-page">
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
              Admin Portal
            </span>

            <h2>
              Control and monitor the entire platform
            </h2>

            <p>
              Manage users, oversee product listings,
              monitor orders, and review system activity
              from one dashboard.
            </p>

            <Link
              to="/admin/users"
              className="dashboard-main-action"
            >
              <Users size={18} />

              Manage Users

              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="welcome-visual">
            <ShieldCheck size={70} />
          </div>
        </section>

        {/* ==========================================
            DASHBOARD SUMMARY
        ========================================== */}

        <div className="admin-dashboard-summary">
          {/* USERS */}

          <Link
            to="/admin/users"
            className="admin-dashboard-stat-card"
          >
            <div className="admin-dashboard-stat-icon">
              <Users size={21} />
            </div>

            <div>
              <span>
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>
            </div>
          </Link>

          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            className="admin-dashboard-stat-card"
          >
            <div className="admin-dashboard-stat-icon">
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
            to="/admin/orders"
            className="admin-dashboard-stat-card"
          >
            <div className="admin-dashboard-stat-icon">
              <ClipboardList size={21} />
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

          {/* ACTIVITIES */}

          <Link
            to="/admin/system-activities"
            className="admin-dashboard-stat-card"
          >
            <div className="admin-dashboard-stat-icon">
              <Activity size={21} />
            </div>

            <div>
              <span>
                Activity Records
              </span>

              <strong>
                {activities.length}
              </strong>
            </div>
          </Link>
        </div>

        {/* ==========================================
            PLATFORM MANAGEMENT
        ========================================== */}

        <div className="dashboard-content-heading">
          <div>
            <h2>
              Platform Management
            </h2>

            <p>
              Access the main administrative tools
              for managing the e-commerce platform.
            </p>
          </div>
        </div>

        {/* ==========================================
            MANAGEMENT CARDS
        ========================================== */}

        <div className="professional-card-grid">
          {/* USERS */}

          <Link
            to="/admin/users"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <Users size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                User Management
              </h3>

              <p>
                Create, edit, delete, and manage
                Admin, Seller, and Buyer accounts.
              </p>
            </div>

            <div className="professional-card-footer">
              Manage Users

              <ArrowRight size={17} />
            </div>
          </Link>

          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <Package size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                Product Management
              </h3>

              <p>
                View and manage products listed
                across the marketplace.
              </p>
            </div>

            <div className="professional-card-footer">
              Manage Products

              <ArrowRight size={17} />
            </div>
          </Link>

          {/* ORDERS */}

          <Link
            to="/admin/orders"
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
                Monitor current orders and manage
                processing and fulfillment status.
              </p>
            </div>

            <div className="professional-card-footer">
              View Orders

              <ArrowRight size={17} />
            </div>
          </Link>

          {/* SYSTEM ACTIVITY */}

          <Link
            to="/admin/system-activities"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <Activity size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                System Activity
              </h3>

              <p>
                Monitor important user interactions
                and platform activity.
              </p>
            </div>

            <div className="professional-card-footer">
              Monitor Activity

              <ArrowRight size={17} />
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;