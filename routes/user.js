const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/home' , userController.getHome);
router.post('/home' , userController.postHome);

router.get('/transfer' , userController.getTransferPage);
router.post('/transfer' , userController.postTransferPage);

router.get('/login' , userController.getLoginPage);
router.post('/login', (req,res,next) => {
    passport.authenticate('local' , {
      successRedirect : '/user/login' , 
      failureRedirect : '/user/home' , 
      failureFlash : true
  })(req,res,next);
});


router.get('/register' , userController.getRegisterPage);
router.post('/register' , userController.PostRegisterPage);


module.exports = router;