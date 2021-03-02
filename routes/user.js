const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/home' , userController.getHome);
router.post('/home' , userController.postHome);

router.get('/transfer' , userController.getTransferPage);
router.post('/transfer' , userController.postTransferPage);

// login routes
router.get('/login' , userController.getLoginPage);

router.post('/login', (req,res,next) => {
    passport.authenticate('local' , {
      successRedirect : '/user/home' , 
      failureRedirect : '/user/login' , 
      failureFlash : true
  })(req,res,next);
});

// logout route
router.post('/logout' , (req,res,next) =>{
  req.logOut();
  res.redirect('/');
})

router.get('/register' , userController.getRegisterPage);
router.post('/register' , userController.PostRegisterPage);


module.exports = router;