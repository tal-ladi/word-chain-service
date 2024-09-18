const express = require('express');
const router = express.Router();
const leaderboardController = require('../controller/leaderboardController')

router.get('/total', leaderboardController.getGlobalLeaders);
router.get('/daily', leaderboardController.getTodayLeaders);


module.exports = router;
