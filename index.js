const express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.set('views','views');
app.set('view engine' , 'ejs');

app.use(BodyParser.urlencoded({extended : false}));

app.use(express.static(path.join(__dirname , 'public')));

mongoose.connect('mongodb+srv://Charchitg123:Charchitg123@cluster0.mvv9m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' , {
   useNewUrlParser : true , useUnifiedTopology : true
})

const Userroutes = require('./routes/user');

app.use('/user' , Userroutes);


app.listen(3000 , ()=>{
   console.log('Connection worked');
});