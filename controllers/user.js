exports.getHome = (req , res , next) => {
    res.render('./home' , {
        PageTitle : "Home"
      });
}

exports.postHome = (req,res,next) => {
  
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