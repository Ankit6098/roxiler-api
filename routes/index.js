const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transectionController');

router.get('/transactions', transactionController.transaction);

module.exports = router;