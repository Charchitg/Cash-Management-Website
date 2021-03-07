const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user');
const transferController = require('../controllers/transfer');


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

// Register User Route

router.get('/register' , userController.getRegisterPage);
router.post('/register' , userController.PostRegisterPage);


router.get('/home' , userController.getHome);
router.post('/home' , userController.postHome);

router.get('/transfer' , transferController.getTransferPage);
router.post('/transfer' , transferController.postTransferPage);

router.get('/transaction' , userController.getTransactions);

// router.get('/transaction/:FriendId' , userController.getFriendTransactions);

module.exports = router;