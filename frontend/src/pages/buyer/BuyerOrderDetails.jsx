import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Package,
  CalendarDays,
  IndianRupee,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";

import { BUYER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function BuyerOrderDetails() {
  const { orderId } =
    useParams();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const buyerId = BUYER_ID;

  const ORDER_API =
    "http://localhost:5000/api/orders";

  const [order, setOrder] =
    useState(
      location.state?.order ||
        null
    );

  const [orderItems, setOrderItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  const formatPrice = (price) => {
    return Number(
      price || 0
    ).toLocaleString(
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

  const formatDate = (
    dateValue
  ) => {
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
  // STATUS
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
  // ITEM SUBTOTAL
  // --------------------------------------------------

  const calculateItemTotal = (
    item
  ) => {
    return (
      Number(item.price || 0) *
      Number(
        item.quantity || 0
      )
    );
  };

  // --------------------------------------------------
  // LOAD ORDER DETAILS
  // --------------------------------------------------

  useEffect(() => {
    const loadOrderDetails =
      async () => {
        try {
          setLoading(true);

          // If page was refreshed,
          // recover order information.

          if (!order) {
            const ordersResponse =
              await fetch(
                `${ORDER_API}/buyer/${buyerId}`
              );

            const ordersData =
              await ordersResponse.json();

            if (
              ordersResponse.ok
            ) {
              const foundOrder =
                ordersData.find(
                  (item) =>
                    Number(
                      item.id
                    ) ===
                    Number(
                      orderId
                    )
                );

              setOrder(
                foundOrder ||
                  null
              );
            }
          }

          // Load products in order.

          const itemsResponse =
            await fetch(
              `${ORDER_API}/${orderId}/items`
            );

          const itemsData =
            await itemsResponse.json();

          if (
            !itemsResponse.ok
          ) {
            setMessage(
              itemsData.message ||
                "Failed to load order details"
            );

            return;
          }

          setOrderItems(
            itemsData
          );

          setMessage("");
        } catch (error) {
          console.error(
            error
          );

          setMessage(
            "Failed to load order details"
          );
        } finally {
          setLoading(false);
        }
      };

    loadOrderDetails();
  }, [orderId]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <AppLayout
        role="buyer"
        title="Order Details"
        subtitle="Loading order information."
      >
        <div className="management-page">
          <div className="management-section">
            Loading order
            details...
          </div>
        </div>
      </AppLayout>
    );
  }

  // --------------------------------------------------
  // NOT FOUND
  // --------------------------------------------------

  if (!order) {
    return (
      <AppLayout
        role="buyer"
        title="Order Details"
        subtitle="Order information."
      >
        <div className="management-page">
          <div className="buyer-orders-empty">
            <Package
              size={40}
            />

            <h2>
              Order not found
            </h2>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/buyer/orders"
                )
              }
            >
              Back to Orders
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppLayout
      role="buyer"
      title={`Order #${order.id}`}
      subtitle="View complete order information and purchased products."
    >
      <div className="management-page">
        {/* BACK */}

        <button
          type="button"
          className="product-back-button"
          onClick={() =>
            navigate(
              "/buyer/orders"
            )
          }
        >
          <ArrowLeft
            size={18}
          />

          Back to Orders
        </button>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ORDER HEADER */}

        <section className="buyer-order-page">
          <div className="buyer-order-page-header">
            <div className="buyer-order-page-title">
              <div className="buyer-order-icon">
                <Package
                  size={22}
                />
              </div>

              <div>
                <span>
                  Order
                </span>

                <h2>
                  #{order.id}
                </h2>

                <p>
                  {formatDate(
                    order.created_at
                  )}
                </p>
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

          {/* SUMMARY */}

          <div className="buyer-order-page-summary">
            <div>
              <CalendarDays
                size={19}
              />

              <span>
                Order Date
              </span>

              <strong>
                {formatDate(
                  order.created_at
                )}
              </strong>
            </div>

            <div>
              <ShoppingBag
                size={19}
              />

              <span>
                Products
              </span>

              <strong>
                {
                  orderItems.length
                }
              </strong>
            </div>

            <div>
              <IndianRupee
                size={19}
              />

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

          {/* PRODUCTS */}

          <div className="buyer-order-page-products">
            <div className="buyer-order-items-heading">
              <h3>
                Products
              </h3>

              <span>
                {
                  orderItems.length
                }{" "}
                item
                {orderItems.length ===
                1
                  ? ""
                  : "s"}
              </span>
            </div>

            {orderItems.length ===
            0 ? (
              <div className="buyer-order-no-items">
                No products found
                for this order.
              </div>
            ) : (
              <div className="buyer-order-item-list">
                {orderItems.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="buyer-order-item"
                    >
                      <div className="buyer-order-item-icon">
                        <Package
                          size={20}
                        />
                      </div>

                      <div className="buyer-order-item-name">
                        <span>
                          Product
                        </span>

                        <strong>
                          {
                            item.name
                          }
                        </strong>

                        <small>
                          Product #
                          {
                            item.product_id
                          }
                        </small>
                      </div>

                      <div className="buyer-order-item-data">
                        <span>
                          Price
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            item.price
                          )}
                        </strong>
                      </div>

                      <div className="buyer-order-item-data">
                        <span>
                          Quantity
                        </span>

                        <strong>
                          {
                            item.quantity
                          }
                        </strong>
                      </div>

                      <div className="buyer-order-item-data buyer-order-item-total">
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            calculateItemTotal(
                              item
                            )
                          )}
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* TOTAL */}

          <div className="buyer-order-page-total">
            <span>
              Order Total
            </span>

            <strong>
              ₹
              {formatPrice(
                order.total_amount
              )}
            </strong>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default BuyerOrderDetails;