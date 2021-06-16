const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Authenticated , NotAuthenticated }  = require('../config/auth');


const userControllers = require('../controllers/user');
const GetControllers = require('../controllers/GetTransaction');
const EditControllers = require('../controllers/EditTransaction');
const CreateControllers  = require('../controllers/CreateTransaction');
const DeleteControllers = require('../controllers/DeleteTransaction');

// login routes
router.get('/login' , NotAuthenticated , userControllers.getLoginPage);

router.post('/login', (req,res,next) => {
    passport.authenticate('local' , {
      successRedirect : '/user/home' , 
      failureRedirect : '/user/login' , 
      failureFlash : true 
  })(req,res,next);
});

router.get('/login/google' , (req,res,next) => {
  passport.authenticate('google' , {
    scope : ['profile', 'email']
  })(req,res,next);
});

// google redirect handling

router.get('/google/redirect' , (req,res,next) =>{
passport.authenticate('google' , {
  successRedirect : '/user/home' , 
  failureRedirect : '/user/register'
})(req,res,next);
});


//  logout route
router.post('/logout' , (req,res,next) =>{
  req.logOut();
  req.flash('success_msg' , "You have logged out successfully");
  res.redirect('/user/login');
})

// Register User Route

router.get('/register' , NotAuthenticated , userControllers.getRegisterPage);
router.post('/register' , userControllers.PostRegisterPage);


router.get('/home'  , Authenticated ,  userControllers.getHome);
router.post('/home' , userControllers.postHome);

router.get('/transfer'  , Authenticated , GetControllers.getTransferPage);
router.post('/transfer' , CreateControllers.postTransferPage);

router.get('/edit-transaction/:TransferId'  , Authenticated , GetControllers.getEditTransaction);
router.post('/edit-transaction/:TransferId' , EditControllers.postEditTransaction);

router.get('/transaction' , Authenticated  ,  GetControllers.getTransactions);

router.get('/profile' , Authenticated , userControllers.getProfile);

router.get('/transaction/:FriendId' , Authenticated  ,  GetControllers.getFriendTransactions);

router.get('/transaction/delete/:TransferId' , Authenticated ,  DeleteControllers.deleteTransaction);



module.exports = router;
