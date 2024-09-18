const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

router.get('/:userId', userController.getUserById);
router.put('/register', userController.registerUser);

module.exports = router;