const database = require('../services/database');

const getGlobalLeaders = async (req, res) => {
  try {
    const result = await database.pool.query(
      'SELECT username, total_points FROM users ORDER BY total_points DESC LIMIT 10'
    );
    
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No leaders found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching global leaderboard' });
  }
};

const getTodayLeaders = async (req, res) => {
    try {
      const result = await database.pool.query(
        `SELECT u.username, SUM(uwc.points) AS daily_points
         FROM user_word_chains uwc
         JOIN users u ON u.user_id = uwc.user_id
         WHERE uwc.date = CURRENT_DATE
         GROUP BY u.username
         ORDER BY daily_points DESC
         LIMIT 10`
      );
      
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching today\'s leaderboard' });
    }
  };

  module.exports = {
    getGlobalLeaders,
    getTodayLeaders,
};