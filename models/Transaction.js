const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
    username :{
        type : String ,
        required : true
    } , 
    friendname : {
        type : String ,
        required : true
    } ,
    amount : {
        type : Number , 
        required : true
    }
});

const Transaction = mongoose.model('transaction' , TransactionSchema);

module.exports = Transaction;