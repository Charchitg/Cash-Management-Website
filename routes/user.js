const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/home' , userController.getHome);
router.post('/home' , userController.postHome);
//router.get('/login' , userController.getLoginPage);

//router.get('/register' , userController.getRegisterPage);

router.get('/friends' , userController.getFriendsPage);

router.post('/friends' , userController.postFriendsPage);

module.exports = router;