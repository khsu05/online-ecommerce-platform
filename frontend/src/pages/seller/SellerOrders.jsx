import { useEffect, useState } from "react";

import {
  Package,
  Eye,
  X,
  CalendarDays,
  IndianRupee,
  User,
  ClipboardList,
  Clock3,
  LoaderCircle,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import { SELLER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function SellerOrders() {
  const sellerId = SELLER_ID;

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

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

    return new Date(dateValue).toLocaleString(
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
  // FETCH SELLER ORDERS
  // =====================================================

  const fetchSellerOrders = async () => {
    try {
      const response = await fetch(
        `${ORDER_API}/seller/${sellerId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load seller orders"
        );

        return;
      }

      setOrders(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load seller orders"
      );
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  // =====================================================
  // VIEW ORDER DETAILS
  // =====================================================

  const viewOrderDetails = async (orderId) => {
    try {
      setDetailsLoading(true);
      setSelectedOrderId(orderId);
      setOrderItems([]);
      setMessage("");

      const response = await fetch(
        `${ORDER_API}/${orderId}/items`
      );

      const data = await response.json();

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
      setDetailsLoading(false);
    }
  };

  // =====================================================
  // CLOSE ORDER DETAILS
  // =====================================================

  const closeOrderDetails = () => {
    setSelectedOrderId(null);
    setOrderItems([]);
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
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

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        await fetchSellerOrders();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to update order status"
      );
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    const normalized = String(
      status || ""
    )
      .trim()
      .toLowerCase();

    if (normalized === "fulfilled") {
      return "seller-order-status-fulfilled";
    }

    if (normalized === "processing") {
      return "seller-order-status-processing";
    }

    return "seller-order-status-pending";
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    const normalized = String(
      status || ""
    )
      .trim()
      .toLowerCase();

    if (normalized === "fulfilled") {
      return <CheckCircle2 size={14} />;
    }

    if (normalized === "processing") {
      return <LoaderCircle size={14} />;
    }

    return <Clock3 size={14} />;
  };

  // =====================================================
  // SELECTED ORDER
  // =====================================================

  const selectedOrder = orders.find(
    (order) =>
      Number(order.id) ===
      Number(selectedOrderId)
  );

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const pendingOrders = orders.filter(
    (order) =>
      String(order.status)
        .toLowerCase()
        .trim() === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      String(order.status)
        .toLowerCase()
        .trim() === "processing"
  ).length;

  const fulfilledOrders = orders.filter(
    (order) =>
      String(order.status)
        .toLowerCase()
        .trim() === "fulfilled"
  ).length;

  // =====================================================
  // ITEM SUBTOTAL
  // =====================================================

  const calculateSubtotal = (item) => {
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
      role="seller"
      title="Order Management"
      subtitle="View, process, and fulfill customer orders."
    >
      <div className="management-page seller-orders-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            ORDER SUMMARY
        ========================================== */}

        <div className="seller-orders-summary">
          <div className="seller-order-summary-card">
            <div className="seller-order-summary-icon">
              <ClipboardList size={20} />
            </div>

            <div>
              <span>Total Orders</span>

              <strong>
                {orders.length}
              </strong>
            </div>
          </div>

          <div className="seller-order-summary-card">
            <div className="seller-order-summary-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {pendingOrders}
              </strong>
            </div>
          </div>

          <div className="seller-order-summary-card">
            <div className="seller-order-summary-icon">
              <LoaderCircle size={20} />
            </div>

            <div>
              <span>Processing</span>

              <strong>
                {processingOrders}
              </strong>
            </div>
          </div>

          <div className="seller-order-summary-card">
            <div className="seller-order-summary-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Fulfilled</span>

              <strong>
                {fulfilledOrders}
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            ORDERS
        ========================================== */}

        <section className="seller-orders-section">
          <div className="seller-orders-header">
            <div>
              <h2>Your Orders</h2>

              <p>
                {orders.length}{" "}
                order
                {orders.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            <ShoppingBag size={22} />
          </div>

          {orders.length === 0 ? (
            <div className="seller-orders-empty">
              <Package size={38} />

              <h3>
                No orders found
              </h3>

              <p>
                Customer orders for your
                products will appear here.
              </p>
            </div>
          ) : (
            <div className="seller-orders-list">
              {orders.map((order) => (
                <article
                  className="seller-order-card"
                  key={order.id}
                >
                  {/* TOP */}

                  <div className="seller-order-card-top">
                    <div className="seller-order-id">
                      <div className="seller-order-main-icon">
                        <Package size={20} />
                      </div>

                      <div>
                        <span>Order</span>

                        <h3>
                          #{order.id}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`seller-order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(
                        order.status
                      )}

                      {order.status}
                    </span>
                  </div>

                  {/* INFORMATION */}

                  <div className="seller-order-info-grid">
                    <div className="seller-order-info-item">
                      <User size={17} />

                      <div>
                        <span>
                          Buyer
                        </span>

                        <strong>
                          Buyer #
                          {
                            order.buyer_id
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="seller-order-info-item">
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

                    <div className="seller-order-info-item">
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

                  {/* PROCESS ORDER */}

                  <div className="seller-order-process">
                    <div>
                      <span>
                        Process Order
                      </span>

                      <small>
                        Update the current
                        order status.
                      </small>
                    </div>

                    <select
                      className="seller-order-status-select"
                      value={
                        order.status
                      }
                      onChange={(
                        event
                      ) =>
                        updateOrderStatus(
                          order.id,
                          event.target.value
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

                  <div className="seller-order-card-footer">
                    <button
                      type="button"
                      className="seller-view-order-button"
                      onClick={() =>
                        viewOrderDetails(
                          order.id
                        )
                      }
                    >
                      <Eye size={16} />

                      View Order Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ==========================================
            ORDER DETAILS
        ========================================== */}

        {selectedOrderId &&
          selectedOrder && (
            <section className="seller-order-details">
              <div className="seller-order-details-header">
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
                  className="seller-order-close-button"
                  onClick={
                    closeOrderDetails
                  }
                  aria-label="Close order details"
                >
                  <X size={18} />
                </button>
              </div>

              {/* DETAIL SUMMARY */}

              <div className="seller-order-detail-summary">
                <div>
                  <User size={18} />

                  <span>
                    Buyer
                  </span>

                  <strong>
                    Buyer #
                    {
                      selectedOrder.buyer_id
                    }
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
                    Order Total
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
                    className={`seller-order-detail-status ${getStatusClass(
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

              <div className="seller-order-detail-products">
                <div className="seller-order-detail-products-heading">
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
                  <div className="seller-order-loading">
                    Loading order
                    details...
                  </div>
                ) : orderItems.length ===
                  0 ? (
                  <div className="seller-order-no-items">
                    No order items
                    found.
                  </div>
                ) : (
                  <div className="seller-order-items">
                    {orderItems.map(
                      (item) => (
                        <div
                          className="seller-order-item"
                          key={
                            item.id
                          }
                        >
                          <div className="seller-order-item-icon">
                            <Package
                              size={19}
                            />
                          </div>

                          <div className="seller-order-item-name">
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

                          <div className="seller-order-item-data">
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

                          <div className="seller-order-item-data">
                            <span>
                              Quantity
                            </span>

                            <strong>
                              {
                                item.quantity
                              }
                            </strong>
                          </div>

                          <div className="seller-order-item-data seller-order-item-subtotal">
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

              <div className="seller-order-details-footer">
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

export default SellerOrders;