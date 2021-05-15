
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const User = require('../models/User');


module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID ,
    clientSecret: process.env.CLIENT_SECRET ,
    callbackURL: "/user/google/redirect",
    passReqToCallback   : true
    } , (request , accessToken , refreshToken , profile , done ) => {
        User.findOne({email : profile.email } , (err , CurrentUser)=>{
            if(err){
                console.log(err);
                return done(err , false);
            }
            else if(!CurrentUser){
                console.log("New User!! , Please Register first");
                return done(null , false);
            }
            else if(CurrentUser){
                console.log("User Exists");
                done(null , CurrentUser);               
            }
        })
    }  
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
  
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
    });
});
}