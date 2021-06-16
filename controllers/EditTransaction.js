const User = require('../models/User');
const Transfer = require('../models/Transfer');
//const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');



exports.postEditTransaction = async (req,res,next) =>{
    try {
      const friendname = req.body.friend;
      const amount = req.body.amount;
      const message = req.body.description;
      const now = new Date;
        let dateNum = now.getDate();
        let month = now.getMonth() + 1;
        let year = now.getFullYear();
        let hour = now.getHours();
        let min = now.getMinutes();
        let AmPm;
        if(hour >= 12){
          AmPm = "PM";
          if(hour > 12){
            hour -= 12;  
          }
        }
        if(hour < 12){
          AmPm = "AM";
          if(hour === 0){
            hour = 12;
          }
        }
        
        const Time = hour.toString() + ":" + min.toString() + " " + AmPm.toString() + " " + dateNum.toString() + "/" + month.toString() + "/" + year.toString();
        
      let uid = req.params.TransferId;
      
      const existing = await Transfer.findOne({ uid : uid });
      if(!existing){
        req.flash('error_msg' , "Transaction not found");
      }  
      if(existing.username.toString() !== req.user.email.toString()){
        req.flash('' , "You cannot edit this transaction");
        res.redirect('/user/edit-transaction');
      }
      
      let Amount = 0;
      const PreviousFriendname = existing.friendname;
      const PreviousAmount = existing.amount;
      //const PreviousMessage = existing.message;
      console.log(typeof(PreviousAmount) , PreviousAmount.length);
      if(PreviousAmount.length === 1){
          const getFriend = await User.findOne({ email : PreviousFriendname[0] });
          if(!getFriend){
            req.flash('error_msg' , "Friend not found");
            res.redirect('/user/transaction');
          }  
          Amount -= parseFloat(PreviousAmount);
          console.log(" Amount1 " , Amount);
          Amount += parseFloat(amount);
          console.log(" Amount2 " , Amount);
          getFriend.borrowMoney -= parseFloat(PreviousAmount);
          console.log("Bm1 " , getFriend.borrowMoney);
          getFriend.borrowMoney += parseFloat(amount);
          console.log("Bm2 " , getFriend.borrowMoney);
          const saveFriend = await getFriend.save();
          console.log("Saved Friend " , saveFriend);
        
        console.log("ld1 " , req.user.lendMoney);
        req.user.lendMoney += parseFloat(Amount);
        console.log("ld2 " , req.user.lendMoney);
          const j = await req.user.friends.findIndex(email => email.name.toString() === PreviousFriendname[0].toString());
          if(j=== -1){
            console.log("Not found");
          }
          else{
            req.user.friends[j].amount -= parseFloat(PreviousAmount);
            req.user.friends[j].amount += parseFloat(amount);          
          }
   
        }
      else{
      for(let i=0;i<PreviousFriendname.length ;i++){
        const getFriend = await User.findOne({ email : PreviousFriendname[i] });
        if(!getFriend){
          req.flash('error_msg' , "Friend not found");
          res.redirect('/user/transaction');
        }  
        Amount -= parseFloat(PreviousAmount[i]);
        console.log(" Amount1 " , Amount);
        Amount += parseFloat(amount[i]);
        console.log(" Amount2 " , Amount);
        getFriend.borrowMoney -= parseFloat(PreviousAmount[i]);
        console.log("Bm1 " , getFriend.borrowMoney);
        getFriend.borrowMoney += parseFloat(amount[i]);
        console.log("Bm2 " , getFriend.borrowMoney);
        const saveFriend = await getFriend.save();
        console.log("Saved Friend " , saveFriend);
      }
      console.log("ld1 " , req.user.lendMoney);
      req.user.lendMoney += parseFloat(Amount);
      console.log("ld2 " , req.user.lendMoney);
      for(let i=0;i<PreviousFriendname.length ; i++){
        const j = await req.user.friends.findIndex(email => email.name.toString() === PreviousFriendname[i].toString());
        if(j=== -1){
          console.log("Not found");
        }
        else{
          req.user.friends[j].amount -= parseFloat(PreviousAmount[i]);
          req.user.friends[j].amount += parseFloat(amount[i]);
          
        }
      }
    } 
      const savedUser = await req.user.save();
      console.log("Saved User " , savedUser);
      const updated = await Transfer.updateOne({username : req.user.email , friendname : friendname , amount : amount , message : message , Time : Time})
      console.log("updated " , updated);
        res.redirect('/user/transaction');
    } catch (err) {
      console.log(err);
    }
   
  }