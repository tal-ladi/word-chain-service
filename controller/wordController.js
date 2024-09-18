const database = require('../services/database');
const { validWordInEnglish } = require('../services/wordService');

const insertTodaysWord = async (word) => {
  try {
    const result = await database.pool.query(
      'INSERT INTO daily_word (word, date) VALUES (LOWER($1), CURRENT_DATE) RETURNING *',
      [word]
    );
    console.log('Word added to DB:', result.rows[0]);
  } catch (error) {
    console.error('Error adding word to DB:', error);
    throw new Error('Error adding today\'s word');
  }
};

const getTodaysWord = async (req, res) => {
  try {
    const result = await database.pool.query('SELECT word FROM daily_word WHERE date = CURRENT_DATE');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No word available for today' });
    }
    res.status(200).json({ word: result.rows[0].word });
  } catch (error) {
    console.error('Error fetching today\'s word:', error);
    res.status(500).json({ error: 'Error fetching today\'s word' });
  }
};

const getCurrentUsersWord = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const currentWord = await getUserLastWordForToday(userId) || await getTodaysWordForChain();

    res.status(200).json({ word: currentWord });
  } catch (error) {
    console.error('Error fetching current user\'s word:', error);
    res.status(500).json({ error: 'Error fetching current user\'s word' });
  }
};

const submitWord = async (req, res) => {
  const { userId, word } = req.params;
  
  try {
    const wordToCompare = await getUserLastWordForToday(userId) || await getTodaysWordForChain();

    if (!isValidWord(word, wordToCompare)) {
      return res.status(400).json({ message: 'Invalid word submission' });
    }

    if (!validWordInEnglish(word)) {
      return res.status(400).json({ message: 'Invalid word in English'});
    }

    await database.pool.query(
      'INSERT INTO user_word_chains (user_id, word, date) VALUES ($1, $2, CURRENT_DATE)',
      [userId, word]
    );

    await database.pool.query(
      'UPDATE users SET total_points = total_points + 1 WHERE user_id = $1',
      [userId]
    );

    res.status(201).json({ message: 'Word submitted successfully!' });
  } catch (error) {
    console.error('Error submitting word:', error);
    res.status(500).json({ error: 'Error submitting word' });
  }
};

function isValidWord(newWord, previousWord) {
  const newWordLength = newWord.length;
  const previousWordLength = previousWord.length;
  
  if (newWordLength === previousWordLength) {
    let diffCount = 0;
    for (let i = 0; i < newWordLength; i++) {
      if (newWord[i] !== previousWord[i]) {
        diffCount++;
      }
      if (diffCount > 1) {
        return false;
      }
    }
    return diffCount === 1;
  }
  
  if (newWordLength === previousWordLength + 1) {
    let mismatchFound = false;
    for (let i = 0, j = 0; i < newWordLength; i++) {
      if (newWord[i] !== previousWord[j]) {
        if (mismatchFound) {
          return false;
        }
        mismatchFound = true;
      } else {
        j++;
      }
    }
    return true;
  }

  return false;
}

const getTodaysWordForChain = async () => {
  const result = await database.pool.query('SELECT word FROM daily_word WHERE date = CURRENT_DATE');
  if (result.rows.length === 0) {
    throw new Error('No word for today');
  }
  return result.rows[0].word;
};

const getUserLastWordForToday = async (userId) => {
  try {
    const result = await database.pool.query(
      `SELECT word 
       FROM user_word_chains 
       WHERE user_id = $1 AND date = CURRENT_DATE
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    // Return the word if found, otherwise return null
    return result.rows.length > 0 ? result.rows[0].word : null;
  } catch (error) {
    console.error('Error fetching user\'s last word:', error);
    throw new Error('Error fetching user\'s last word');
  }
};


module.exports = {
    insertTodaysWord,
    getTodaysWord,
    getCurrentUsersWord,
    submitWord,
};
