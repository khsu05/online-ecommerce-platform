import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ShoppingBag,
  History,
  ClipboardList,
  Heart,
  User,
  ArrowRight,
  Package,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

function BuyerDashboard() {
  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products/browse"
        );

        const data = await response.json();

        if (response.ok) {
          setFeaturedProducts(
            Array.isArray(data)
              ? data.slice(0, 4)
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load featured products:",
          error
        );
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <AppLayout
      role="buyer"
      title="Buyer Dashboard"
      subtitle="Browse products and manage your shopping activity."
    >
      <div className="professional-dashboard">
        {/* HERO */}

        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              Buyer Portal
            </span>

            <h2>
              Discover products and manage your
              shopping activity
            </h2>

            <p>
              Browse available products, track
              your orders, manage favorites, and
              maintain your account information.
            </p>

            <Link
              to="/buyer/products"
              className="dashboard-main-action"
            >
              <ShoppingBag size={18} />

              Browse Products

              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="welcome-visual">
            <ShoppingBag size={70} />
          </div>
        </section>

        {/* FEATURED PRODUCTS */}

        <section className="buyer-featured-section">
          <div className="dashboard-content-heading buyer-featured-heading">
            <div>
              <h2>Featured Products</h2>

              <p>
                Explore some products currently
                available in the marketplace.
              </p>
            </div>

            <Link
              to="/buyer/products"
              className="featured-view-all"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="buyer-featured-empty">
              <Package size={32} />

              <span>
                No products available.
              </span>
            </div>
          ) : (
            <div className="buyer-featured-grid">
              {featuredProducts.map(
                (product) => (
                  <Link
                    key={product.id}
                    to={`/buyer/products/${product.id}`}
                    state={{ product }}
                    className="buyer-featured-card"
                  >
                    <div className="buyer-featured-image">
                      <img
                        src={
                          product.image_url ||
                          "/products/placeholder.jpg"
                        }
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.onerror =
                            null;

                          event.currentTarget.src =
                            "/products/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="buyer-featured-info">
                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                      <strong>
                        ₹
                        {formatPrice(
                          product.price
                        )}
                      </strong>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        {/* REQUIRED BUYER DASHBOARD FEATURES */}

        <div className="dashboard-content-heading">
          <div>
            <h2>Your Shopping</h2>

            <p>
              Access your shopping history,
              orders, wishlist, and account.
            </p>
          </div>
        </div>

        <div className="professional-card-grid">
          <Link
            to="/buyer/history"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <History size={24} />
            </div>

            <div className="professional-card-text">
              <h3>
                Product Browsing History
              </h3>

              <p>
                Revisit products you recently
                viewed while browsing.
              </p>
            </div>

            <div className="professional-card-footer">
              View History
              <ArrowRight size={17} />
            </div>
          </Link>

          <Link
            to="/buyer/orders"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <ClipboardList size={24} />
            </div>

            <div className="professional-card-text">
              <h3>Order History</h3>

              <p>
                View previous purchases and
                track their current status.
              </p>
            </div>

            <div className="professional-card-footer">
              View Orders
              <ArrowRight size={17} />
            </div>
          </Link>

          <Link
            to="/buyer/wishlist"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <Heart size={24} />
            </div>

            <div className="professional-card-text">
              <h3>Wishlist</h3>

              <p>
                Manage favorite products and
                track price changes.
              </p>
            </div>

            <div className="professional-card-footer">
              View Wishlist
              <ArrowRight size={17} />
            </div>
          </Link>

          <Link
            to="/buyer/account"
            className="professional-dashboard-card"
          >
            <div className="professional-card-icon">
              <User size={24} />
            </div>

            <div className="professional-card-text">
              <h3>Account Overview</h3>

              <p>
                Manage personal details,
                payment methods, and addresses.
              </p>
            </div>

            <div className="professional-card-footer">
              Manage Account
              <ArrowRight size={17} />
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default BuyerDashboard;