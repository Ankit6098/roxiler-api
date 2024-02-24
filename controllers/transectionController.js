module.exports.transaction = async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10 } = req.query;
    const offset = (page - 1) * perPage;
    const query = `
          SELECT * FROM transactions
          WHERE productTitle LIKE ? OR description LIKE ? OR price LIKE ?
          LIMIT ? OFFSET ?
        `;
    const [rows] = await pool.query(query, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      perPage,
      offset,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API for statistics
module.exports.statistics = async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      const [totalSaleAmount] = await pool.query(`
        SELECT SUM(price) AS totalAmount
        FROM transactions
        WHERE dateOfSale BETWEEN ? AND ?
      `, [startDate, endDate]);
      const [totalSoldItems] = await pool.query(`
        SELECT COUNT(*) AS totalSoldItems
        FROM transactions
        WHERE dateOfSale BETWEEN ? AND ? AND sold = 1
      `, [startDate, endDate]);
      const [totalNotSoldItems] = await pool.query(`
        SELECT COUNT(*) AS totalNotSoldItems
        FROM transactions
        WHERE dateOfSale BETWEEN ? AND ? AND sold = 0
      `, [startDate, endDate]);
      res.json({
        totalSaleAmount: totalSaleAmount.totalAmount || 0,
        totalSoldItems: totalSoldItems.totalSoldItems || 0,
        totalNotSoldItems: totalNotSoldItems.totalNotSoldItems || 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
  // API for bar chart
module.exports.barChart = async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      const priceRanges = [
        { range: '0-100', count: await countItemsInPriceRange(startDate, endDate, 0, 100) },
        { range: '101-200', count: await countItemsInPriceRange(startDate, endDate, 101, 200) },
        { range: '201-300', count: await countItemsInPriceRange(startDate, endDate, 201, 300) },
        { range: '301-400', count: await countItemsInPriceRange(startDate, endDate, 301, 400) },
        { range: '401-500', count: await countItemsInPriceRange(startDate, endDate, 401, 500) },
        { range: '501-600', count: await countItemsInPriceRange(startDate, endDate, 501, 600) },
        { range: '601-700', count: await countItemsInPriceRange(startDate, endDate, 601, 700) },
        { range: '701-800', count: await countItemsInPriceRange(startDate, endDate, 701, 800) },
        { range: '801-900', count: await countItemsInPriceRange(startDate, endDate, 801, 900) },
        { range: '901-above', count: await countItemsInPriceRange(startDate, endDate, 901, Number.MAX_SAFE_INTEGER) }
      ];
      res.json(priceRanges);
    } catch (error) {
      console.error('Error fetching bar chart data:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
  // Helper function to count items in a price range
  async function countItemsInPriceRange(startDate, endDate, minPrice, maxPrice) {
    const [result] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM transactions
      WHERE dateOfSale BETWEEN ? AND ? AND price >= ? AND price <= ?
    `, [startDate, endDate, minPrice, maxPrice]);
    return result.count || 0;
  }
  
  // API for pie chart
module.exports.pieChart = async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      const [categories] = await pool.query(`
        SELECT category, COUNT(*) AS itemCount
        FROM transactions
        WHERE dateOfSale BETWEEN ? AND ?
        GROUP BY category
      `, [startDate, endDate]);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching pie chart data:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
  // Combined response API
module.exports.combined = async (req, res) => {
    try {
      const { month } = req.params;
      const [statistics, barChart, pieChart] = await Promise.all([
        axios.get(`http://localhost:${PORT}/statistics/${month}`),
        axios.get(`http://localhost:${PORT}/bar-chart/${month}`),
        axios.get(`http://localhost:${PORT}/pie-chart/${month}`)
      ]);
      res.json({
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data
      });
    } catch (error) {
        console.error('Error fetching combined data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};