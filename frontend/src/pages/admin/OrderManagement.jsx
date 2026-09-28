import { useEffect, useState } from "react";

import {
  ClipboardList,
  Package,
  User,
  IndianRupee,
  CalendarDays,
  Eye,
  X,
  Clock3,
  LoaderCircle,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState("");
  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const ORDER_API =
    "http://localhost:5000/api/orders";

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
  // FORMAT DATE
  // =====================================================

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

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        ORDER_API
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load orders"
        );

        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load orders"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // VIEW ORDER DETAILS
  // =====================================================

  const viewOrderItems = async (
    orderId
  ) => {
    try {
      setSelectedOrderId(
        orderId
      );

      setOrderItems([]);

      setDetailsLoading(
        true
      );

      setMessage("");

      const response = await fetch(
        `${ORDER_API}/${orderId}/items`
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load order details"
        );

        return;
      }

      setOrderItems(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load order details"
      );
    } finally {
      setDetailsLoading(
        false
      );
    }
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const closeOrderDetails = () => {
    setSelectedOrderId(null);
    setOrderItems([]);
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `${ORDER_API}/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to update order status"
      );
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

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
      return "admin-order-status-fulfilled";
    }

    if (
      normalized ===
      "processing"
    ) {
      return "admin-order-status-processing";
    }

    return "admin-order-status-pending";
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

  // =====================================================
  // SUMMARY
  // =====================================================

  const pendingCount =
    orders.filter(
      (order) =>
        String(order.status)
          .toLowerCase()
          .trim() ===
        "pending"
    ).length;

  const processingCount =
    orders.filter(
      (order) =>
        String(order.status)
          .toLowerCase()
          .trim() ===
        "processing"
    ).length;

  const fulfilledCount =
    orders.filter(
      (order) =>
        String(order.status)
          .toLowerCase()
          .trim() ===
        "fulfilled"
    ).length;

  const selectedOrder =
    orders.find(
      (order) =>
        Number(order.id) ===
        Number(
          selectedOrderId
        )
    );

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const calculateSubtotal = (
    item
  ) => {
    return (
      Number(item.price || 0) *
      Number(item.quantity || 0)
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="admin"
      title="Order Management"
      subtitle="Monitor orders, update status, and manage fulfillment."
    >
      <div className="management-page admin-orders-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div className="admin-order-summary">
          <div className="admin-order-summary-card">
            <div className="admin-order-summary-icon">
              <ClipboardList
                size={20}
              />
            </div>

            <div>
              <span>
                Total Orders
              </span>

              <strong>
                {orders.length}
              </strong>
            </div>
          </div>

          <div className="admin-order-summary-card">
            <div className="admin-order-summary-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>
                Pending
              </span>

              <strong>
                {pendingCount}
              </strong>
            </div>
          </div>

          <div className="admin-order-summary-card">
            <div className="admin-order-summary-icon">
              <LoaderCircle
                size={20}
              />
            </div>

            <div>
              <span>
                Processing
              </span>

              <strong>
                {processingCount}
              </strong>
            </div>
          </div>

          <div className="admin-order-summary-card">
            <div className="admin-order-summary-icon">
              <CheckCircle2
                size={20}
              />
            </div>

            <div>
              <span>
                Fulfilled
              </span>

              <strong>
                {fulfilledCount}
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            CURRENT ORDERS
        ========================================== */}

        <section className="admin-order-section">
          <div className="admin-order-section-header">
            <div>
              <h2>
                Current Orders
              </h2>

              <p>
                {orders.length}{" "}
                order
                {orders.length ===
                1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            <ShoppingBag
              size={22}
            />
          </div>

          {orders.length ===
          0 ? (
            <div className="admin-orders-empty">
              <Package
                size={38}
              />

              <h3>
                No orders found
              </h3>

              <p>
                Marketplace orders
                will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-order-list">
              {orders.map(
                (order) => (
                  <article
                    className="admin-order-card"
                    key={
                      order.id
                    }
                  >
                    {/* HEADER */}

                    <div className="admin-order-card-top">
                      <div className="admin-order-id-area">
                        <div className="admin-order-main-icon">
                          <Package
                            size={20}
                          />
                        </div>

                        <div>
                          <span>
                            Order
                          </span>

                          <h3>
                            #
                            {
                              order.id
                            }
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`admin-order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(
                          order.status
                        )}

                        {
                          order.status
                        }
                      </span>
                    </div>

                    {/* DETAILS */}

                    <div className="admin-order-info-grid">
                      <div className="admin-order-info-item">
                        <User
                          size={17}
                        />

                        <div>
                          <span>
                            Buyer
                          </span>

                          <strong>
                            {order.buyer_name ||
                              `Buyer #${order.buyer_id}`}
                          </strong>
                        </div>
                      </div>

                      <div className="admin-order-info-item">
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

                      <div className="admin-order-info-item">
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
                    </div>

                    {/* STATUS UPDATE */}

                    <div className="admin-order-process">
                      <div>
                        <span>
                          Update Status
                        </span>

                        <small>
                          Change current
                          order status.
                        </small>
                      </div>

                      <select
                        value={
                          order.status
                        }
                        onChange={(
                          event
                        ) =>
                          updateStatus(
                            order.id,
                            event
                              .target
                              .value
                          )
                        }
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Fulfilled">
                          Fulfilled
                        </option>
                      </select>
                    </div>

                    {/* ACTION */}

                    <div className="admin-order-card-footer">
                      <button
                        type="button"
                        className="admin-view-order-button"
                        onClick={() =>
                          viewOrderItems(
                            order.id
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
        </section>

        {/* ==========================================
            ORDER DETAILS
        ========================================== */}

        {selectedOrderId &&
          selectedOrder && (
            <section className="admin-order-details">
              <div className="admin-order-details-header">
                <div>
                  <span>
                    Order Details
                  </span>

                  <h2>
                    Order #
                    {
                      selectedOrder.id
                    }
                  </h2>

                  <p>
                    {formatDate(
                      selectedOrder.created_at
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-order-close-button"
                  onClick={
                    closeOrderDetails
                  }
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              {/* SUMMARY */}

              <div className="admin-order-detail-summary">
                <div>
                  <User
                    size={18}
                  />

                  <span>
                    Buyer
                  </span>

                  <strong>
                    {selectedOrder.buyer_name ||
                      `Buyer #${selectedOrder.buyer_id}`}
                  </strong>
                </div>

                <div>
                  <ShoppingBag
                    size={18}
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
                    size={18}
                  />

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {formatPrice(
                      selectedOrder.total_amount
                    )}
                  </strong>
                </div>

                <div>
                  {getStatusIcon(
                    selectedOrder.status
                  )}

                  <span>
                    Status
                  </span>

                  <strong
                    className={`admin-order-detail-status ${getStatusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {
                      selectedOrder.status
                    }
                  </strong>
                </div>
              </div>

              {/* ITEMS */}

              <div className="admin-order-products">
                <div className="admin-order-products-heading">
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

                {detailsLoading ? (
                  <div className="admin-order-loading">
                    Loading order
                    details...
                  </div>
                ) : orderItems.length ===
                  0 ? (
                  <div className="admin-order-loading">
                    No order items
                    found.
                  </div>
                ) : (
                  <div className="admin-order-items">
                    {orderItems.map(
                      (item) => (
                        <div
                          className="admin-order-item"
                          key={
                            item.id
                          }
                        >
                          <div className="admin-order-item-icon">
                            <Package
                              size={19}
                            />
                          </div>

                          <div className="admin-order-item-name">
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

                          <div className="admin-order-item-data">
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

                          <div className="admin-order-item-data">
                            <span>
                              Quantity
                            </span>

                            <strong>
                              {
                                item.quantity
                              }
                            </strong>
                          </div>

                          <div className="admin-order-item-data">
                            <span>
                              Subtotal
                            </span>

                            <strong>
                              ₹
                              {formatPrice(
                                calculateSubtotal(
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

              <div className="admin-order-details-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    closeOrderDetails
                  }
                >
                  Close Details
                </button>
              </div>
            </section>
          )}
      </div>
    </AppLayout>
  );
}

export default OrderManagement;