import { useEffect, useState } from "react";

import {
  ShoppingBag,
  PackageCheck,
  IndianRupee,
  TrendingUp,
  BarChart3,
  CalendarDays,
} from "lucide-react";

import { SELLER_ID } from "../../config/userIds";
import AppLayout from "../../components/AppLayout";

function SalesPerformance() {
  const sellerId = SELLER_ID;

  // =====================================================
  // STATE
  // =====================================================

  const [summary, setSummary] = useState({
    total_orders: 0,
    total_units_sold: 0,
    total_sales: 0,
  });

  const [trend, setTrend] = useState([]);

  const [message, setMessage] = useState("");

  const API_URL =
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
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(
      dateValue
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FETCH SALES PERFORMANCE
  // =====================================================

  const fetchSalesPerformance = async () => {
    try {
      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load sales performance"
        );

        return;
      }

      setSummary(
        data.summary || {
          total_orders: 0,
          total_units_sold: 0,
          total_sales: 0,
        }
      );

      setTrend(
        data.trend || []
      );

      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load sales performance"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchSalesPerformance();
  }, []);

  // =====================================================
  // MAX SALES FOR GRAPH
  // =====================================================

  const maxSales =
    trend.length > 0
      ? Math.max(
          ...trend.map((item) =>
            Number(
              item.sales_amount || 0
            )
          ),
          1
        )
      : 1;

  // =====================================================
  // BAR WIDTH
  // =====================================================

  const getBarWidth = (
    salesAmount
  ) => {
    const amount =
      Number(
        salesAmount || 0
      );

    if (amount === 0) {
      return 0;
    }

    const percentage =
      (amount / maxSales) *
      100;

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
      title="Sales Performance"
      subtitle="Review sales reports and performance trends."
    >
      <div className="management-page seller-sales-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            SALES SUMMARY
        ========================================== */}

        <div className="seller-sales-summary">
          {/* TOTAL ORDERS */}

          <div className="seller-sales-summary-card">
            <div className="seller-sales-summary-icon">
              <ShoppingBag
                size={21}
              />
            </div>

            <div>
              <span>
                Total Orders
              </span>

              <strong>
                {summary.total_orders ??
                  0}
              </strong>
            </div>
          </div>

          {/* UNITS SOLD */}

          <div className="seller-sales-summary-card">
            <div className="seller-sales-summary-icon">
              <PackageCheck
                size={21}
              />
            </div>

            <div>
              <span>
                Total Units Sold
              </span>

              <strong>
                {summary.total_units_sold ??
                  0}
              </strong>
            </div>
          </div>

          {/* TOTAL SALES */}

          <div className="seller-sales-summary-card">
            <div className="seller-sales-summary-icon">
              <IndianRupee
                size={21}
              />
            </div>

            <div>
              <span>
                Total Sales
              </span>

              <strong>
                ₹
                {formatPrice(
                  summary.total_sales
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            SALES TREND GRAPH
        ========================================== */}

        <section className="seller-sales-section">
          <div className="seller-sales-section-header">
            <div>
              <h2>
                Sales Trend
              </h2>

              <p>
                Compare your sales
                amounts across recorded
                sales dates.
              </p>
            </div>

            <TrendingUp
              size={22}
            />
          </div>

          {trend.length === 0 ? (
            <div className="seller-sales-empty">
              <BarChart3
                size={38}
              />

              <h3>
                No sales trend data
              </h3>

              <p>
                Sales performance will
                appear here after
                orders are recorded.
              </p>
            </div>
          ) : (
            <div className="seller-sales-chart">
              {trend.map(
                (item) => {
                  const salesAmount =
                    Number(
                      item.sales_amount ||
                        0
                    );

                  return (
                    <div
                      className="seller-sales-chart-row"
                      key={
                        item.sale_date
                      }
                    >
                      {/* DATE */}

                      <div className="seller-sales-chart-date">
                        <div className="seller-sales-date-icon">
                          <CalendarDays
                            size={16}
                          />
                        </div>

                        <div>
                          <span>
                            Sale Date
                          </span>

                          <strong>
                            {formatDate(
                              item.sale_date
                            )}
                          </strong>
                        </div>
                      </div>

                      {/* GRAPH */}

                      <div className="seller-sales-bar-area">
                        <div className="seller-sales-bar-track">
                          <div
                            className="seller-sales-bar-fill"
                            style={{
                              width: `${getBarWidth(
                                salesAmount
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* SALES VALUE */}

                      <div className="seller-sales-chart-value">
                        <span>
                          Sales
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            salesAmount
                          )}
                        </strong>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ==========================================
            SALES REPORT
        ========================================== */}

        <section className="seller-sales-section">
          <div className="seller-sales-section-header">
            <div>
              <h2>
                Sales Report
              </h2>

              <p>
                Detailed sales report
                showing orders, units
                sold, and sales amount.
              </p>
            </div>

            <BarChart3
              size={22}
            />
          </div>

          <div className="seller-sales-table-wrapper">
            <table className="seller-sales-table">
              <thead>
                <tr>
                  <th>
                    Date
                  </th>

                  <th>
                    Orders
                  </th>

                  <th>
                    Units Sold
                  </th>

                  <th>
                    Sales Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {trend.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="seller-sales-table-empty"
                    >
                      No sales data
                      found.
                    </td>
                  </tr>
                ) : (
                  trend.map(
                    (item) => (
                      <tr
                        key={
                          item.sale_date
                        }
                      >
                        {/* DATE */}

                        <td>
                          <div className="seller-sales-table-date">
                            <CalendarDays
                              size={15}
                            />

                            <span>
                              {formatDate(
                                item.sale_date
                              )}
                            </span>
                          </div>
                        </td>

                        {/* ORDERS */}

                        <td>
                          <div className="seller-sales-table-metric">
                            <ShoppingBag
                              size={15}
                            />

                            <strong>
                              {
                                item.total_orders
                              }
                            </strong>
                          </div>
                        </td>

                        {/* UNITS */}

                        <td>
                          <div className="seller-sales-table-metric">
                            <PackageCheck
                              size={15}
                            />

                            <strong>
                              {
                                item.units_sold
                              }
                            </strong>
                          </div>
                        </td>

                        {/* SALES */}

                        <td>
                          <strong className="seller-sales-amount">
                            ₹
                            {formatPrice(
                              item.sales_amount
                            )}
                          </strong>
                        </td>
                      </tr>
                    )
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

export default SalesPerformance;