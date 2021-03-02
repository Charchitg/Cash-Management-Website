const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField : 'email' , passwordField : 'password'} , (email , password , done) => {
        User.findOne({ email : email })
        .then(user =>{
            // no user is found
         if(!user){
             console.log('1');
             return done(null,false,{message : 'No user exist with this email'});
         }
            // password check
         if(password !== user.password){
            console.log('2');
             return done(null ,false , {message : 'Password is incorrect'});
         }
            // user is found
            console.log('3');
        return done(null , user , {message : 'Login successful'});
        })
        .catch((err) => {
           console.log(err);
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

