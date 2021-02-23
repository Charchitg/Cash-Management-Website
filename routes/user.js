const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/home' , userController.getHome);
router.post('/home' , userController.postHome);

router.get('/friends' , userController.getFriendsPage);
router.post('/friends' , userController.postFriendsPage);

router.get('/login' , userController.getLoginPage);
router.post('/login', userController.PostLoginPage)

router.get('/register' , userController.getRegisterPage);
router.post('/register' , userController.PostRegisterPage);


module.exports = router;