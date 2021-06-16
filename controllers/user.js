const User = require('../models/User');
const bcrypt = require('bcryptjs');


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
  const name = req.body.name;
  let Email = req.body.email;
  const email = Email.toLowerCase();
  const password = req.body.password;
  const confirm = req.body.confirm;
 
  if(!name || !email || !password || !confirm){
    errors.push("Please Enter all the fields");
   
  }
  User.findOne({email : email } , (err , user) =>{
    if(err){
      console.log(err);
      throw err;
    }
    if(user){
     
      errors.push("User Already exists");
    }
  });

  if(password.length < 8){
   
    errors.push("Password is too short , length should be more than 8");
   
  }

  if(password !== confirm ){
    
    errors.push("Passwords do not match");
  }

  console.log(errors);
  if(errors.length){
    console.log(errors);
    res.render('./register' , {
      PageTitle : "Register" ,
      errors : errors , 
      path : '/user/register' , 
      name , 
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

      const user = new User( {name , email , password : hash });
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
  friend = parseInt(req.body.friends);
  amount = parseInt(req.body.amount);
  splitamount = amount/friend;
  splitamount = splitamount.toPrecision(4);
  res.redirect('/user/transfer');
}

exports.getProfile = async (req,res,next) => {
  const userid = req.user.email;
  const user = await User.findOne({ email : userid })
  .then(console.log("user info found"))
  .catch((err) => {
    console.log(err);
    res.status(400).render('./error' , {
      PageTitle : "Error" , 
      error_msg : "User info not found" , 
      path : '/error'
    })
  });
 
  console.log('user ', user);
  res.render('./profile' , {
    PageTitle : "User Profile" , 
    user : user , 
    path : '/user/profile'
  });
}