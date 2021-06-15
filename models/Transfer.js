const mongoose = require('mongoose');
const TransferSchema = new mongoose.Schema({
    username :{
        type : String ,
        required : true
    } , 
    friendname : {
        type : Array ,
        required : true
    } ,
    amount : {
        type : Array , 
        required : true
    } ,
    uid : {
        type : String , 
        required : true
    }
    ,  
    message : {
        type : String , 
        required : true
    } , 
    Time : {
        type : String 
    } 
});

const Transfer = mongoose.model('transaction' , TransferSchema);

module.exports = Transfer;