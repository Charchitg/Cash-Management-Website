const User = require('../models/User');
const Transaction = require('../models/Transaction');
const passport = require('passport');

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

exports.getTransferPage = (req,res,next) =>{
  res.render('./transfer' , {
    PageTitle : "Transfer" , 
    Username : username , 
    friends : friend 
  });
}

exports.postTransferPage = (req,res,next) =>{
  const friendArr = req.body.friend;
  const amountArr = req.body.amount;
 
  // Problem in this logic


  // for (let i = 0; i < friendArr.length; i++) {
  //   const friendname = friendArr[i];
  //   const amount = amountArr[i];
  //   const transaction = new Transaction(req.user.email , friendname , amount);
  //   transaction.save()
  //   .then(() => {
  //     req.user.lendMoney += amount ; 
  //     User.findOne({email : friendname } , (err , user ) =>{
  //       if(err){ console.log(err);}
  //       else{user.borrowMoney += amount ; }
  //     })
  //   }
  //   )
  //   .catch(err =>{
  //     console.log(err);
  //   })
  // }


}


exports.getLoginPage = (req,res,next) => {
  res.render('./login', {
    PageTitle : "Login"
  });
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

  const user = new User( {name , email , password });
  user.save()
  .then(res.redirect('/user/login'))
  .catch((err) =>{
    console.log(err);
  });

}