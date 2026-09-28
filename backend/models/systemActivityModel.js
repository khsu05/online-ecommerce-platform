const db = require("../config/db");

const getAllActivities = (callback) => {
  const sql = `
    SELECT
      sa.id,
      sa.user_id,

      CASE
        WHEN u.id IS NOT NULL
          THEN u.name

        WHEN sa.user_name_snapshot IS NOT NULL
          AND sa.user_name_snapshot != 'Deleted User'
          THEN CONCAT(
            sa.user_name_snapshot,
            ' (Deleted)'
          )

        ELSE 'Deleted User'
      END AS user_name,

      sa.activity,
      sa.created_at

    FROM system_activities sa

    LEFT JOIN users u
      ON sa.user_id = u.id

    ORDER BY sa.created_at DESC
  `;

  db.query(sql, callback);
};

const logActivity = (
  userId,
  activity,
  callback
) => {
  const sql = `
    INSERT INTO system_activities (
      user_id,
      user_name_snapshot,
      activity
    )

    SELECT
      id,
      name,
      ?

    FROM users
    WHERE id = ?
  `;

  db.query(
    sql,
    [activity, userId],
    callback
  );
};

module.exports = {
  getAllActivities,
  logActivity,
};