const express = require('express');
const userRoutes = require('./userRoute');
const wordRoutes = require('./wordRoute');
const leaderboardRoutes = require('./leaderboardRoute');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/words', wordRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;
