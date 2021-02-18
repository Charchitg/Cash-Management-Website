let friend = 0;
let username = "";

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

// exports.getLoginPage = (req,res,next) => {
//   res.render('./login', {
//     PageTitle : "Login"
//   });
// }

// exports.getRegisterPage = (req,res,next) =>{
//   res.render('./register', {
//     PageTitle : "Register"
//   });
// }

exports.getFriendsPage = (req,res,next) =>{
  res.render('./friends' , {
    PageTitle : "Friends" , 
    Username : username , 
    friends : friend
  });
}

exports.postFriendsPage = (req,res,next) =>{
  // console.log(req.body);
  // //res.send('post friend');
  res.redirect('/user/home');
}