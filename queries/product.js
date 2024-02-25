const db = require("../config/db");

// Get all products
function getAllProduct(callback) {
  db.query("SELECT * FROM PRODUCT_TRANSACTION", (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

// Get transactions
function transaction(search, perPage, offset, callback) {
  db.query(
    `SELECT * FROM PRODUCT_TRANSACTION WHERE productTitle LIKE ? OR description LIKE ? OR category LIKE ? LIMIT ? OFFSET ?`,
    [`%${search}%`, `%${search}%`, `%${search}%`, perPage, offset],
    (err, rows) => {
      if (rows.length === 0) {
        return callback({ error: "No data found" });
      }
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    }
  );
}

// Add statistics
function statistics(year, month, callback) {
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-30`;

  let totalSaleAmount, totalSoldItems, totalNotSoldItems;

  db.query(
    `
      SELECT SUM(price) AS totalAmount
      FROM PRODUCT_TRANSACTION
      WHERE dateOfSale BETWEEN ? AND ?
    `,
    [startDate, endDate],
    (err, rows) => {
      if (err) {
        return callback(err);
      }
      totalSaleAmount = rows[0].totalAmount;

      db.query(
        `
          SELECT COUNT(*) AS totalSoldItems
          FROM PRODUCT_TRANSACTION
          WHERE dateOfSale BETWEEN ? AND ? AND sold = 1
        `,
        [startDate, endDate],
        (err, rows) => {
          if (err) {
            return callback(err);
          }
          totalSoldItems = rows[0].totalSoldItems;

          db.query(
            `
              SELECT COUNT(*) AS totalNotSoldItems
              FROM PRODUCT_TRANSACTION
              WHERE dateOfSale BETWEEN ? AND ? AND sold = 0
            `,
            [startDate, endDate],
            (err, rows) => {
              if (err) {
                return callback(err);
              }
              totalNotSoldItems = rows[0].totalNotSoldItems;

              callback(null, {
                totalSaleAmount,
                totalSoldItems,
                totalNotSoldItems,
              });
            }
          );
        }
      );
    }
  );
}


// Get count of items in price range
function countItemsInPriceRange(
  startDate,
  endDate,
  minPrice,
  maxPrice,
  callback
) {
  console.log(startDate, endDate, minPrice, maxPrice);
  db.query(
    `
      SELECT COUNT(*) AS count
      FROM transactions
      WHERE dateOfSale BETWEEN ? AND ? AND price >= ? AND price <= ?
    `,
    [startDate, endDate, minPrice, maxPrice],
    (err, count) => {
      if (err) {
        return callback(err);
      }
      return callback(null, count);
    }
  );
}


// Get pie chart data
function pieChart(year, month, callback) {
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-30`;
  db.query(
    `
    SELECT category, COUNT(*) AS itemCount
        FROM transactions
        WHERE dateOfSale BETWEEN ? AND ?
        GROUP BY category
        `,
    [startDate, endDate],
    (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    }
  );
}

module.exports = {
  getAllProduct,
  transaction,
  statistics,
  countItemsInPriceRange,
  pieChart,
};
