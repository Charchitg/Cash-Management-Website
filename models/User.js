const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name :{
       type : String , 
       required : true
    } , 
    email : {
        type : String , 
        required : true
    } , 
    password : {
        type : String , 
        required : true 
    } , 
    borrowMoney : {
        type : Number , 
        default : 0
    } , 
    lendMoney : {
        type : Number , 
        default : 0
    } , 
    friends : {
        type : Array
    }
});

const User = mongoose.model('User' , UserSchema);

module.exports = User;