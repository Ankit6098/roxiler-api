const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transectionController");

router.get("/", transactionController.getAllProduct);
router.get("/transactions", transactionController.transaction);
router.get("/statistics/:year/:month", transactionController.statistics);
router.get("/bar-chart/:year/:month", transactionController.barChart);
router.get("/pie-chart/:year/:month", transactionController.pieChart);
router.get("/combined/:year/:month", transactionController.combined);

module.exports = router;
