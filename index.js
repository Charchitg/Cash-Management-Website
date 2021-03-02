// Basic app setup
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

// setting up view engine
app.set('views','views');
app.set('view engine' , 'ejs');


// app use setups
app.use(BodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(session({
   secret : "Trial Login" , 
   resave : false , 
   saveUninitialized : false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// connecting to db
mongoose.connect('mongodb+srv://Charchitg123:Charchitg123@cluster0.mvv9m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' , {
   useNewUrlParser : true , useUnifiedTopology : true
})

const Userroutes = require('./routes/user');

app.use('/user' , Userroutes);



app.listen(3000 , ()=>{
   console.log('Connection worked');
});