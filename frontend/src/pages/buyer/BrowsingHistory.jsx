import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  History,
  Eye,
  Package,
  Clock3,
} from "lucide-react";

import { BUYER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function BrowsingHistory() {
  const buyerId = BUYER_ID;

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL =
    `http://localhost:5000/api/browsing-history/buyer/${buyerId}`;

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(
      dateValue
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // --------------------------------------------------
  // FETCH HISTORY
  // --------------------------------------------------

  const fetchHistory = async () => {
    try {
      const response =
        await fetch(API_URL);

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load browsing history"
        );

        return;
      }

      setHistory(data);

      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load browsing history"
      );
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchHistory();
  }, []);

  // --------------------------------------------------
  // VIEW PRODUCT
  // --------------------------------------------------

  const viewProduct = (item) => {
    navigate(
      `/buyer/products/${item.product_id}`,
      {
        state: {
          product: {
            id: item.product_id,
            name: item.name,
            description:
              item.description,
            price: item.price,
            image_url:
              item.image_url,
            inventory_quantity:
              item.inventory_quantity,
          },
        },
      }
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppLayout
      role="buyer"
      title="Browsing History"
      subtitle="View products you recently explored."
    >
      <div className="management-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* HEADER */}

        <div className="history-page-header">
          <div>
            <h2>
              Recently Viewed Products
            </h2>

            <p>
              {history.length}{" "}
              product
              {history.length === 1
                ? ""
                : "s"}{" "}
              in your browsing history
            </p>
          </div>

          <div className="history-header-icon">
            <History size={22} />
          </div>
        </div>

        {/* EMPTY HISTORY */}

        {history.length === 0 ? (
          <div className="history-empty-state">
            <div className="history-empty-icon">
              <History size={34} />
            </div>

            <h2>
              No browsing history yet
            </h2>

            <p>
              Products you view from the
              marketplace will appear here.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/buyer/products"
                )
              }
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map(
              (item) => (
                <article
                  className="history-card"
                  key={item.id}
                >
                  {/* IMAGE */}

                  <div className="history-image-wrapper">
                    <img
                      src={
                        item.image_url ||
                        "/products/placeholder.jpg"
                      }
                      alt={item.name}
                      onError={(
                        event
                      ) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          "/products/placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="history-card-content">
                    <div className="history-product-heading">
                      <h3>
                        {item.name}
                      </h3>

                      <span>
                        #
                        {
                          item.product_id
                        }
                      </span>
                    </div>

                    <p className="history-description">
                      {
                        item.description
                      }
                    </p>

                    <div className="history-price">
                      ₹
                      {formatPrice(
                        item.price
                      )}
                    </div>

                    {/* VIEWED TIME */}

                    <div className="history-viewed-time">
                      <Clock3
                        size={14}
                      />

                      <div>
                        <span>
                          Viewed
                        </span>

                        <strong>
                          {formatDate(
                            item.viewed_at
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div className="history-card-actions">
                    <button
                      type="button"
                      className="history-view-button"
                      onClick={() =>
                        viewProduct(
                          item
                        )
                      }
                    >
                      <Eye size={16} />

                      View Product
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default BrowsingHistory;