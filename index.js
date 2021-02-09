const express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const app = express();


app.set('views','views');
app.set('view engine' , 'ejs');

app.use(BodyParser.urlencoded({extended : false}));
app.use(BodyParser.json());
app.use(express.static(path.join(__dirname , 'public')));

const Userroutes = require('./routes/user');

app.use('/user' , Userroutes);


app.listen(3000 , ()=>{
   console.log('Connection worked');
});