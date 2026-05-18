const { sequelize } = require("../index");

/**
 * Ensures booking_${code} supports admin walk-in bookings without users table.
 * Safe to call repeatedly (ignores duplicate column errors).
 */
async function ensureBookingOfflineColumns(code) {
  const table = `booking_${code}`;

  try {
    await sequelize.query(
      `ALTER TABLE ${table} MODIFY COLUMN user_id INT NULL`
    );
  } catch (err) {
    if (!/Duplicate|doesn't exist|Unknown column/i.test(err.message)) {
      console.warn(`ensureBookingOfflineColumns user_id (${code}):`, err.message);
    }
  }

  const addColumn = async (sql) => {
    try {
      await sequelize.query(sql);
    } catch (err) {
      if (!/Duplicate column/i.test(err.message)) {
        throw err;
      }
    }
  };

  await addColumn(
    `ALTER TABLE ${table} ADD COLUMN offline_username VARCHAR(100) NULL AFTER user_id`
  );
  await addColumn(
    `ALTER TABLE ${table} ADD COLUMN offline_phone VARCHAR(20) NULL AFTER offline_username`
  );
}

module.exports = { ensureBookingOfflineColumns };
