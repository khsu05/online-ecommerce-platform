import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Eye,
  CalendarDays,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Clock3,
  LoaderCircle,
} from "lucide-react";

import { BUYER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function BuyerOrderHistory() {
  const buyerId = BUYER_ID;

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const ORDER_API =
    "http://localhost:5000/api/orders";

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
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // FETCH ORDERS
  // --------------------------------------------------

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${ORDER_API}/buyer/${buyerId}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load order history"
        );

        return;
      }

      setOrders(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load order history"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --------------------------------------------------
  // OPEN ORDER DETAILS PAGE
  // --------------------------------------------------

  const viewOrderDetails = (
    order
  ) => {
    navigate(
      `/buyer/orders/${order.id}`,
      {
        state: {
          order,
        },
      }
    );
  };

  // --------------------------------------------------
  // STATUS CLASS
  // --------------------------------------------------

  const getStatusClass = (
    status
  ) => {
    const normalized =
      String(status || "")
        .toLowerCase()
        .trim();

    if (
      normalized ===
      "fulfilled"
    ) {
      return "order-status-fulfilled";
    }

    if (
      normalized ===
      "processing"
    ) {
      return "order-status-processing";
    }

    return "order-status-pending";
  };

  // --------------------------------------------------
  // STATUS ICON
  // --------------------------------------------------

  const getStatusIcon = (
    status
  ) => {
    const normalized =
      String(status || "")
        .toLowerCase()
        .trim();

    if (
      normalized ===
      "fulfilled"
    ) {
      return (
        <CheckCircle2
          size={14}
        />
      );
    }

    if (
      normalized ===
      "processing"
    ) {
      return (
        <LoaderCircle
          size={14}
        />
      );
    }

    return (
      <Clock3 size={14} />
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppLayout
      role="buyer"
      title="Order History"
      subtitle="View your purchases and track their current status."
    >
      <div className="management-page">
        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* HEADER */}

        <div className="buyer-orders-header">
          <div>
            <h2>
              Your Orders
            </h2>

            <p>
              {orders.length}{" "}
              order
              {orders.length === 1
                ? ""
                : "s"}{" "}
              found
            </p>
          </div>

          <div className="buyer-orders-header-icon">
            <ShoppingBag
              size={22}
            />
          </div>
        </div>

        {/* EMPTY */}

        {orders.length === 0 ? (
          <div className="buyer-orders-empty">
            <div className="buyer-orders-empty-icon">
              <Package
                size={35}
              />
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              Your purchased
              products will appear
              here after you place
              an order.
            </p>
          </div>
        ) : (
          <div className="buyer-orders-list">
            {orders.map(
              (order) => (
                <article
                  key={order.id}
                  className="buyer-order-card"
                >
                  {/* TOP */}

                  <div className="buyer-order-top">
                    <div className="buyer-order-id-area">
                      <div className="buyer-order-icon">
                        <Package
                          size={20}
                        />
                      </div>

                      <div>
                        <span>
                          Order
                        </span>

                        <h3>
                          #{order.id}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`buyer-order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(
                        order.status
                      )}

                      {order.status}
                    </span>
                  </div>

                  {/* ORDER INFO */}

                  <div className="buyer-order-info-grid">
                    <div className="buyer-order-info">
                      <CalendarDays
                        size={17}
                      />

                      <div>
                        <span>
                          Order Date
                        </span>

                        <strong>
                          {formatDate(
                            order.created_at
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="buyer-order-info">
                      <IndianRupee
                        size={17}
                      />

                      <div>
                        <span>
                          Total Amount
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            order.total_amount
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div className="buyer-order-footer">
                    <button
                      type="button"
                      className="buyer-order-details-button"
                      onClick={() =>
                        viewOrderDetails(
                          order
                        )
                      }
                    >
                      <Eye
                        size={16}
                      />

                      View Order Details
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

export default BuyerOrderHistory;