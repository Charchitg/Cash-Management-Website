let friend = 0;
let username = "";

const User = require('../models/User');

exports.getHome = (req , res , next) => {
    res.render('./home' , {
        PageTitle : "Home"
      });
}

exports.postHome = (req,res,next) => {
  friend = req.body.friends;
  username = req.body.username;
  //res.send('post home');
  res.redirect('/user/friends');
}

exports.getFriendsPage = (req,res,next) =>{
  let friend_name = new Array(friend);
let amount = new Array(friend);
  res.render('./friends' , {
    PageTitle : "Friends" , 
    Username : username , 
    friends : friend , 
    friend_arr : friend_name , 
    amount_arr : amount
  });
}

exports.postFriendsPage = (req,res,next) =>{
  console.log(req);
}


exports.getLoginPage = (req,res,next) => {
  res.render('./login', {
    PageTitle : "Login"
  });
}

exports.PostLoginPage = (req,res,next) =>{
  const Email = req.body.username;
  const password = req.body.Password;
  
}


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
  
const user = {
  name : name , 
  email : email , 
  password : password
}

  const newUser = new User(user);
  newUser.save()
  .then(res.redirect('/user/home'))
  .catch((err) => console.log(err))
}