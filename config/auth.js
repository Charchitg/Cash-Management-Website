const User = require("../models/User");
module.exports = {
    Authenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg' , 'User Login Required');
        res.redirect('/user/login');
    } , 
    NotAuthenticated : function(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','User Already logged in');
        res.redirect('/user/home');
    }
}    
