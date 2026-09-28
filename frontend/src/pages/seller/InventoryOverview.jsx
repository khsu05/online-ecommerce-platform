import { useEffect, useState } from "react";

import {
  Boxes,
  Package,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

import { SELLER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function InventoryOverview() {
  const sellerId = SELLER_ID;

  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL =
    `http://localhost:5000/api/seller-dashboard/${sellerId}/inventory-overview`;

  // =====================================================
  // FETCH INVENTORY
  // =====================================================

  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load inventory overview"
        );

        return;
      }

      setInventory(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load inventory overview"
      );
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // =====================================================
  // INVENTORY CALCULATIONS
  // =====================================================

  const maxInventory =
    inventory.length > 0
      ? Math.max(
          ...inventory.map((item) =>
            Number(item.inventory_quantity)
          ),
          1
        )
      : 1;

  const totalUnits = inventory.reduce(
    (total, item) =>
      total +
      Number(item.inventory_quantity || 0),
    0
  );

  const lowStockItems = inventory.filter(
    (item) =>
      item.stock_status === "Low Stock"
  );

  // =====================================================
  // BAR WIDTH
  // =====================================================

  const getBarWidth = (quantity) => {
    const numericQuantity =
      Number(quantity || 0);

    if (numericQuantity === 0) {
      return 0;
    }

    const percentage =
      (numericQuantity / maxInventory) * 100;

    return Math.max(
      percentage,
      4
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="seller"
      title="Inventory Overview"
      subtitle="Monitor stock levels and low-stock alerts."
    >
      <div className="management-page seller-inventory-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div className="seller-inventory-summary">
          <div className="inventory-summary-card">
            <div className="inventory-summary-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                Products
              </span>

              <strong>
                {inventory.length}
              </strong>
            </div>
          </div>

          <div className="inventory-summary-card">
            <div className="inventory-summary-icon">
              <Boxes size={21} />
            </div>

            <div>
              <span>
                Total Units
              </span>

              <strong>
                {totalUnits}
              </strong>
            </div>
          </div>

          <div className="inventory-summary-card">
            <div className="inventory-summary-icon">
              <AlertTriangle
                size={21}
              />
            </div>

            <div>
              <span>
                Low Stock Alerts
              </span>

              <strong>
                {
                  lowStockItems.length
                }
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            INVENTORY GRAPH
        ========================================== */}

        <section className="seller-inventory-section">
          <div className="seller-inventory-section-header">
            <div>
              <h2>
                Inventory Levels
              </h2>

              <p>
                Compare current stock
                quantities across your
                products.
              </p>
            </div>

            <BarChart3
              size={22}
            />
          </div>

          {inventory.length === 0 ? (
            <div className="seller-inventory-empty">
              <Boxes
                size={38}
              />

              <h3>
                No inventory data
              </h3>

              <p>
                Inventory information
                for your products will
                appear here.
              </p>
            </div>
          ) : (
            <div className="seller-inventory-chart">
              {inventory.map(
                (item) => {
                  const quantity =
                    Number(
                      item.inventory_quantity
                    );

                  const isLowStock =
                    item.stock_status ===
                    "Low Stock";

                  return (
                    <div
                      className="seller-inventory-chart-row"
                      key={
                        item.product_id
                      }
                    >
                      {/* PRODUCT */}

                      <div className="seller-inventory-chart-product">
                        <div className="seller-inventory-chart-icon">
                          <Package
                            size={17}
                          />
                        </div>

                        <div>
                          <strong>
                            {
                              item.product_name
                            }
                          </strong>

                          <span>
                            Product #
                            {
                              item.product_id
                            }
                          </span>
                        </div>
                      </div>

                      {/* BAR */}

                      <div className="seller-inventory-bar-area">
                        <div className="seller-inventory-bar-track">
                          <div
                            className={`seller-inventory-bar-fill ${
                              isLowStock
                                ? "seller-inventory-bar-low"
                                : ""
                            }`}
                            style={{
                              width: `${getBarWidth(
                                quantity
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* QUANTITY */}

                      <div className="seller-inventory-chart-quantity">
                        <strong>
                          {quantity}
                        </strong>

                        <span>
                          units
                        </span>
                      </div>

                      {/* STATUS */}

                      <span
                        className={`inventory-status-badge ${
                          isLowStock
                            ? "inventory-status-low"
                            : "inventory-status-good"
                        }`}
                      >
                        {
                          item.stock_status
                        }
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ==========================================
            LOW STOCK ALERTS
        ========================================== */}

        <section className="seller-inventory-section">
          <div className="seller-inventory-section-header">
            <div>
              <h2>
                Low Stock Alerts
              </h2>

              <p>
                Products that currently
                need inventory attention.
              </p>
            </div>

            <AlertTriangle
              size={22}
            />
          </div>

          {lowStockItems.length ===
          0 ? (
            <div className="inventory-no-alerts">
              <div className="inventory-no-alerts-icon">
                <Boxes
                  size={22}
                />
              </div>

              <div>
                <strong>
                  No low-stock alerts
                </strong>

                <span>
                  All products currently
                  have sufficient
                  inventory.
                </span>
              </div>
            </div>
          ) : (
            <div className="inventory-alert-list">
              {lowStockItems.map(
                (item) => (
                  <div
                    className="inventory-alert-card"
                    key={
                      item.product_id
                    }
                  >
                    <div className="inventory-alert-icon">
                      <AlertTriangle
                        size={19}
                      />
                    </div>

                    <div className="inventory-alert-info">
                      <strong>
                        {
                          item.product_name
                        }
                      </strong>

                      <span>
                        Product #
                        {
                          item.product_id
                        }
                      </span>
                    </div>

                    <div className="inventory-alert-stock">
                      <span>
                        Remaining
                      </span>

                      <strong>
                        {
                          item.inventory_quantity
                        }{" "}
                        units
                      </strong>
                    </div>

                    <span className="inventory-status-badge inventory-status-low">
                      {
                        item.stock_status
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==========================================
            INVENTORY DETAILS
        ========================================== */}

        <section className="seller-inventory-section">
          <div className="seller-inventory-section-header">
            <div>
              <h2>
                Inventory Details
              </h2>

              <p>
                Complete inventory
                information for your
                product listings.
              </p>
            </div>

            <Boxes size={22} />
          </div>

          <div className="seller-inventory-table-wrapper">
            <table className="seller-inventory-table">
              <thead>
                <tr>
                  <th>
                    Product ID
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Inventory Quantity
                  </th>

                  <th>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {inventory.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="seller-inventory-table-empty"
                    >
                      No inventory data
                      found.
                    </td>
                  </tr>
                ) : (
                  inventory.map(
                    (item) => {
                      const isLowStock =
                        item.stock_status ===
                        "Low Stock";

                      return (
                        <tr
                          key={
                            item.product_id
                          }
                        >
                          <td>
                            #
                            {
                              item.product_id
                            }
                          </td>

                          <td>
                            <div className="inventory-table-product">
                              <div className="inventory-table-product-icon">
                                <Package
                                  size={16}
                                />
                              </div>

                              <strong>
                                {
                                  item.product_name
                                }
                              </strong>
                            </div>
                          </td>

                          <td>
                            <strong className="inventory-table-quantity">
                              {
                                item.inventory_quantity
                              }
                            </strong>{" "}
                            units
                          </td>

                          <td>
                            <span
                              className={`inventory-status-badge ${
                                isLowStock
                                  ? "inventory-status-low"
                                  : "inventory-status-good"
                              }`}
                            >
                              {
                                item.stock_status
                              }
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default InventoryOverview;