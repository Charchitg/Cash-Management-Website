const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/' , userController.getHome);

//router.post('/' , userController.friendsInput);

router.post('/friends' , userController.friendsInput);

router.get('/friends' , userController.getfriendsOutput);

module.exports = router;