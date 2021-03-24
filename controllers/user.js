const User = require('../models/User');
const bcrypt = require('bcryptjs');
//const Transfer = require('../models/Transfer');

exports.getLoginPage = (req,res,next) => {
  res.render('./login', {
    PageTitle : "Login" , 
    path : "/user/login"
  });
}
// Post Login Route is written in routes files

exports.getRegisterPage = (req,res,next) =>{
  res.render('./register', {
    PageTitle : "Register" , 
    path : "/user/register"
  });
}


exports.PostRegisterPage = (req,res,next) =>{
  let errors = [];
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirm = req.body.confirm;
 
  if(!username || !email || !password || !confirm){
    errors.push("Please Enter all the fields");
    console.log("Please Enter all the fields");
  }
  User.findOne({email : email } , (err , user) =>{
    if(err){
      console.log(err);
      throw err;
    }
    if(user){
      console.log("User Already exists");
      errors.push("User Already exists");
    }
  });

  if(password.length < 8){
    console.log("Password is too short , length should be more than 8");
    errors.push("Password is too short , length should be more than 8");
   
  }

  if(password !== confirm ){
    console.log("Passwords do not match");
    errors.push("Passwords do not match");
  }

  console.log(errors);
  if(errors.length){
    console.log(errors);
    res.render('./register' , {
      PageTitle : "Register" ,
      errors : errors , 
      username , 
      email , 
      password ,
      confirm
    });
  }

else{
  bcrypt.genSalt(10 , (err , salt)=>{

    if(err){
      console.log(err);
      throw err;
    }

    bcrypt.hash(password , salt , (err , hash ) => {

      if(err){
        console.log(err);
        throw err;
      }

      const user = new User( {username , email , password : hash });
      user.save()
      .then(res.redirect('/user/login'))
      .catch((err) =>{
        console.log(err);
        throw err;
        });
    });
  });
}
  
}


exports.getHome = (req , res , next) => {
    res.render('./home' , {
        PageTitle : "Home" , 
        path : "/user/home"
      });
}

exports.postHome = (req,res,next) => {
  friend = req.body.friends;
  username = req.body.username;
  res.redirect('/user/transfer');
}

