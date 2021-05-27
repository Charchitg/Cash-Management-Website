// Basic app setup
require('dotenv').config();
const express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const app = express();

// mongoose setup
const mongoose = require('mongoose');

// passportjs requirements
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
// passport-configs
const initialise = require('./config/passport-config');

initialise(passport);

// google  oauth configs
const googleoauth = require('./config/google-oauth');

googleoauth(passport);


// setting up view engine
app.set('views','views');
app.set('view engine' , 'ejs');



// app use setups
app.use(BodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(session({
   secret : process.env.SECRET_KEY , 
   resave : false , 
   saveUninitialized : false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// connecting to db
mongoose.connect(
   process.env.MONGO_URI,
   { useNewUrlParser: true, useUnifiedTopology: true  , useFindAndModify : false},
   () => {console.log("Connected to DB");
});


// GLobal variables for messages

app.use((req,res,next) =>{
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});


const Userroutes = require('./routes/user');
const { NotAuthenticated } = require('./config/auth');


app.use('/user' , Userroutes);

// Lander route
app.get('/' , NotAuthenticated ,  (req,res,next) => {
   res.render('lander' , {
      PageTitle : "Welcome" , 
      path : '/'   
   }); 
});

const PORT = process.env.PORT || 5000 ;

app.listen(PORT, ()=> {
   console.log(`Connection worked at ${PORT}`);
});