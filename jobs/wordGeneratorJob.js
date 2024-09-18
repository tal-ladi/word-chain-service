const cron = require('node-cron');
const { fetchRandomWord } = require('../services/wordService');
const { insertTodaysWord } = require('../controller/wordController');

const generateAndAddWord = async () => {
  try {
    await insertTodaysWord(await fetchRandomWord());
  } catch (error) {
    console.error('Error generating and adding word:', error);
  }
};

cron.schedule('0 0 * * *', async () => {
  console.log('Running daily word generation job...');
  await generateAndAddWord();
});

module.exports = {
  generateAndAddWord,
};
