const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');


module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField : 'username' , passwordField : 'password'} , (email , password , done) => {
        User.findOne({ email : email })
        .then(user =>{
            // no user is found
         if(!user){
             
             return done(null,false,{message : 'No user exist with this email'});
         }
            // password check
         bcrypt.compare(password , user.password , (err , res) => {


             if(err){
                done(err,false);
             }

             
             if(res === false){
                
             return done(null ,false);
             }
            
             if(res === true){
                 // user is found
               
                return done(null , user);
             } 
        })
    })
        .catch((err) => {
           done(err,false);
        });
    })
);
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
  
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
    });
  });
}

