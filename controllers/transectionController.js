const { json } = require("express");
const db = require("../config/db");
const query = require("../queries/product");
const axios = require("axios");

// API for getting all products
module.exports.getAllProduct = async (req, res) => {
  query.getAllProduct((err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
};

// API for transaction
module.exports.transaction = async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10 } = req.query;
    const offset = (page - 1) * perPage;
    query.transaction(search, perPage, offset, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API for statistics
module.exports.statistics = async (req, res) => {
  try {
    const { year, month } = req.params;
    query.statistics(year, month, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API for bar chart
module.exports.barChart = async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-30`;
    const priceRanges = [
      {
        range: "0-100",
        count: await countItemsInPriceRange(startDate, endDate, 0, 100),
      },
      {
        range: "101-200",
        count: await countItemsInPriceRange(startDate, endDate, 101, 200),
      },
      {
        range: "201-300",
        count: await countItemsInPriceRange(startDate, endDate, 201, 300),
      },
      {
        range: "301-400",
        count: await countItemsInPriceRange(startDate, endDate, 301, 400),
      },
      {
        range: "401-500",
        count: await countItemsInPriceRange(startDate, endDate, 401, 500),
      },
      {
        range: "501-600",
        count: await countItemsInPriceRange(startDate, endDate, 501, 600),
      },
      {
        range: "601-700",
        count: await countItemsInPriceRange(startDate, endDate, 601, 700),
      },
      {
        range: "701-800",
        count: await countItemsInPriceRange(startDate, endDate, 701, 800),
      },
      {
        range: "801-900",
        count: await countItemsInPriceRange(startDate, endDate, 801, 900),
      },
      {
        range: "901-above",
        count: await countItemsInPriceRange(
          startDate,
          endDate,
          901,
          Number.MAX_SAFE_INTEGER
        ),
      },
    ];
    res.json(priceRanges);
  } catch (error) {
    console.error("Error fetching bar chart data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

function countItemsInPriceRange(startDate, endDate, minPrice, maxPrice) {
  return new Promise((resolve, reject) => {
    // Assuming query is a function provided by your database library
    query.countItemsInPriceRange(
      startDate,
      endDate,
      minPrice,
      maxPrice,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].count || 0);
        }
      }
    );
  });
}

// API for pie chart
module.exports.pieChart = async (req, res) => {
  try {
    const { year, month } = req.params;
    query.pieChart(year, month, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error("Error fetching pie chart data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Combined response API
module.exports.combined = async (req, res) => {
  try {
    const { year, month } = req.params;
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:8000/api/statistics/${year}/${month}`), // Assuming the server is running on localhost:8000 or change the URL accordingly
      axios.get(`http://localhost:8000/api/bar-chart/${year}/${month}`), // Assuming the server is running on localhost:8000 or change the URL accordingly
      axios.get(`http://localhost:8000/api/pie-chart/${year}/${month}`), // Assuming the server is running on localhost:8000 or change the URL accordingly
    ]);
    res.json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
