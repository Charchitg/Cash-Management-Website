const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Transfer = require('../models/Transfer');

exports.getLoginPage = (req,res,next) => {
  res.render('./login', {
    PageTitle : "Login"
  });
}
// Post Login Route is written in routes files

exports.getRegisterPage = (req,res,next) =>{
  res.render('./register', {
    PageTitle : "Register"
  });
}


exports.PostRegisterPage = (req,res,next) =>{
  const name = req.body.Username;
  const email = req.body.Email;
  const password = req.body.Password;
  const Confirm = req.body.ConfirmPassword;
  
  User.findOne({email : email } , (err , user) =>{
    if(err){
      console.log(err);
    }
    if(user){
      console.log("User Already exists");
    }
  });

  if(password.length < 8){
    console.log("Password is too short , length should be more than 8");
  }

  if(password !== Confirm ){
    console.log("Passwords do not match");
  }

  const salt = bcrypt.genSalt(10 , (err , salt)=>{

    if(err){
      console.log(err);
      res.redirect('/user/register');
    }

    bcrypt.hash(password , salt , (err , hash ) => {

      if(err){
        console.log(err);
        res.redirect('/user/register');
      }

      const user = new User( {name , email , password : hash });
      user.save()
      .then(res.redirect('/user/login'))
      .catch((err) =>{
        console.log(err);
        });
    });
  });

  
}



exports.getHome = (req , res , next) => {
    res.render('./home' , {
        PageTitle : "Home"
      });
}

exports.postHome = (req,res,next) => {
  friend = req.body.friends;
  username = req.body.username;
  res.redirect('/user/transfer');
}

exports.getTransactions = (req,res,next) => {
  Transfer.find({username : req.user.email }).limit(10)
  .then((Transactions)=>{
    console.log(Transactions);
      res.render('./transaction' , {
        PageTitle : "Transactions" , 
        Transfers : Transactions
      })
  })
  .catch(err => console.log(err));
}