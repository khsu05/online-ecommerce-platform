import { useEffect, useState } from "react";

import {
  Activity,
  UserRound,
  Clock3,
  ListChecks,
  RefreshCw,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

function SystemActivity() {
  // =====================================================
  // STATE
  // =====================================================

  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const API_URL =
    "http://localhost:5000/api/system-activities";

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
        second: "2-digit",
      }
    );
  };

  // =====================================================
  // FETCH ACTIVITIES
  // =====================================================

  const fetchActivities = async () => {
    try {
      setRefreshing(true);

      const response =
        await fetch(API_URL);

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load system activities"
        );

        return;
      }

      setActivities(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load system activities"
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchActivities();

    const interval =
      setInterval(() => {
        fetchActivities();
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // LATEST ACTIVITY
  // =====================================================

  const latestActivity =
    activities.length > 0
      ? activities[0]
      : null;

  // =====================================================
  // UI
  // =====================================================

  return (
    <AppLayout
      role="admin"
      title="System Activity"
      subtitle="Monitor platform activities and user interactions."
    >
      <div className="management-page admin-activity-page">
        {/* MESSAGE */}

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div className="admin-activity-summary">
          {/* TOTAL */}

          <div className="admin-activity-summary-card">
            <div className="admin-activity-summary-icon">
              <ListChecks
                size={21}
              />
            </div>

            <div>
              <span>
                Activities
              </span>

              <strong>
                {
                  activities.length
                }
              </strong>
            </div>
          </div>

          {/* REFRESH */}

          <div className="admin-activity-summary-card">
            <div className="admin-activity-summary-icon">
              <RefreshCw
                size={21}
                className={
                  refreshing
                    ? "admin-refresh-spin"
                    : ""
                }
              />
            </div>

            <div>
              <span>
                Auto Refresh
              </span>

              <strong className="admin-activity-refresh-value">
                Every 5 seconds
              </strong>
            </div>
          </div>

          {/* LATEST */}

          <div className="admin-activity-summary-card">
            <div className="admin-activity-summary-icon">
              <Clock3
                size={21}
              />
            </div>

            <div>
              <span>
                Latest Activity
              </span>

              <strong className="admin-activity-latest-value">
                {latestActivity
                  ? formatDate(
                      latestActivity.created_at
                    )
                  : "No activity"}
              </strong>
            </div>
          </div>
        </div>

        {/* ==========================================
            ACTIVITY LOG
        ========================================== */}

        <section className="admin-activity-section">
          <div className="admin-activity-section-header">
            <div className="admin-activity-heading">
              <div className="admin-activity-heading-icon">
                <Activity
                  size={20}
                />
              </div>

              <div>
                <h2>
                  Recent System Activities
                </h2>

                <p>
                  Platform activity log
                  updates automatically
                  every 5 seconds.
                </p>
              </div>
            </div>

            <div className="admin-activity-live">
              <span className="admin-activity-live-dot" />

              Monitoring
            </div>
          </div>

          {/* EMPTY */}

          {activities.length ===
          0 ? (
            <div className="admin-activity-empty">
              <Activity
                size={38}
              />

              <h3>
                No system activities
              </h3>

              <p>
                Platform activities
                will appear here when
                users interact with
                the system.
              </p>
            </div>
          ) : (
            <div className="admin-activity-table-wrapper">
              <table className="admin-activity-table">
                <thead>
                  <tr>
                    <th>
                      Activity ID
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      User ID
                    </th>

                    <th>
                      Activity
                    </th>

                    <th>
                      Date & Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map(
                    (
                      activity
                    ) => (
                      <tr
                        key={
                          activity.id
                        }
                      >
                        {/* ACTIVITY ID */}

                        <td>
                          <span className="admin-activity-id">
                            #
                            {
                              activity.id
                            }
                          </span>
                        </td>

                        {/* USER */}

                        <td>
                          <div className="admin-activity-user">
                            <div className="admin-activity-user-icon">
                              <UserRound
                                size={16}
                              />
                            </div>

                            <strong>
                              {activity.user_name ??
                                "Deleted User"}
                            </strong>
                          </div>
                        </td>

                        {/* USER ID */}

                        <td>
                          <span className="admin-activity-user-id">
                            {activity.user_id ??
                              "-"}
                          </span>
                        </td>

                        {/* ACTIVITY */}

                        <td>
                          <div className="admin-activity-description">
                            <Activity
                              size={14}
                            />

                            <span>
                              {
                                activity.activity
                              }
                            </span>
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <div className="admin-activity-date">
                            <Clock3
                              size={14}
                            />

                            <span>
                              {formatDate(
                                activity.created_at
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default SystemActivity;