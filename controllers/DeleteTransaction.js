const User = require('../models/User');
const Transfer = require('../models/Transfer');
//const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');


exports.deleteTransaction = async (req , res , next ) => {
    const uid = req.params.TransferId;
    try {
      const existing = await Transfer.findOne({uid:uid});
      //console.log(" existing " , existing);
      if(!existing){
        console.log("Transaction not found");
        req.flash('error_msg' , "Transaction not found");
        res.redirect('/user/transaction');
      }
  
      // const user = await User.findOne({email : existing.username});
      // if(!user){
      //   console.log("User not found");
      //   res.redirect('/user/transaction');
      // }
      //console.log("user" , user);
      if(existing.username.toString() !== req.user.email.toString()){
        req.flash('error_msg' , "You cannot delete this Transaction");
      }
      else{
        console.log('valid deletion');
      }
      let Amount = 0;
      for(let i=0;i<existing.friendname.length;i++){
        const friend = await User.findOne({email : existing.friendname[i]});
        if(!friend){
        console.log("User not found");
        res.redirect('/user/transaction');
        }
        for(let j=0;j<user.friends.length;j++){
          if(friend.email.toString() === req.user.friends[j].name.toString()){
        
          req.user.friends[j].amount -= parseFloat(existing.amount[i]);
          console.log("friend arr update");
          break;
        }      
       }
        friend.borrowMoney -= parseFloat(existing.amount[i]);
        Amount += parseFloat(existing.amount[i]);
       const Saved = await friend.save();
       console.log("SAved " , Saved);
      }  
      req.user.lendMoney -= Amount;
      const saveduser = await req.user.save();  
      console.log("User After Saving" , saveduser);
      const Deleted = await Transfer.deleteOne({uid : uid});
      
      if(Deleted.n === 1){
        req.flash("success_msg" , 'Deletion Succesful');
        res.redirect('/user/transaction');
      }
      
    } catch (err) {
      console.log(err);
    }
  }
  