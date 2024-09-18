const express = require('express');
const router = express.Router();
const wordController = require('../controller/wordController')

router.get('/', wordController.getTodaysWord);
router.get('/:userId', wordController.getCurrentUsersWord);
router.post('/:userId/:word', wordController.submitWord);

module.exports = router;