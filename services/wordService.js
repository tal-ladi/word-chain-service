const axios = require('axios');
const wordlist = require('wordlist-english');
const englishWords = wordlist['english'];

const validWordInEnglish = (word) => {
  return englishWords.includes(word.toLowerCase());;
};

const fetchRandomWord = async (minlength = 3, maxlength = 6) => {
    try {
      const response = await axios.get(
        `https://random-word.ryanrk.com/api/en/word/random/?minlength=${minlength}&maxlength=${maxlength}`
      );
      const randomWord = response.data[0];
      console.log('Fetched word:', randomWord);
      return randomWord;
    } catch (error) {
      console.error('Error fetching word from API:', error);
      throw new Error('Failed to fetch word');
    }
};

module.exports = {
  fetchRandomWord,
  validWordInEnglish
};
