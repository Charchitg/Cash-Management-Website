const User = require('../models/User');
const Transfer = require('../models/Transfer');
//const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');


exports.getTransferPage = (req,res,next) =>{

    res.render('./transfer' , {
      PageTitle : "Transfer" , 
      amount : splitamount , 
      friends : friend  , 
      path : "/user/transfer"
    });
  }

  
exports.postTransferPage = async (req,res,next) =>{
    const friendArr = req.body.friend;
    const amountArr = req.body.amount;
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
    console.log(Time);

  if( typeof(friendArr) === "string" ){
// ONLY ONE FRIEND LOGIC  

  await User.findOne({ email : friendArr } , ( err , friend ) => {
    if(err){
          console.log(err);
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        error_msg : "Network error" , 
        path : '/error'
      });
    } 
    else if(!friend){
      req.flash('error_msg' , "Friend not Found");
      console.log(' User  NOT Found ');
      res.render('./transfer' , {
        PageTitle : "Transfer" , 
        error_msg : " User Not Found" , 
        friends : 1 , 
        splitamount : parseFloat(amountArr),
        path : '/user/transfer'
      });
    }
    else{
      const username = req.user.email;
      const friendname = friend.email;
      const amount = parseFloat(amountArr);

          req.user.lendMoney += amount;
          friend.borrowMoney += amount;
          friend.save()
          .then(console.log(`${friend.email} db updated`))
          .catch((err) => console.log(err));
          const uid = uuid.v4();
          const NewTransfer = new Transfer({username , friendname , amount  , uid , message , Time});
          NewTransfer.save()
          .then(() =>{ 
              console.log('New Transfer Added');
                let Exists = false;
                for(let i=0;i<req.user.friends.length;i++){
                  if(req.user.friends[i].name.toString() === friend.email.toString()){
                    Exists = true;
                    req.user.friends[i].amount += amount;
                    console.log(req.user.friends);
                  }
                }
                if(!Exists){
                  req.user.friends.push({name : friend.email , amount });
                  console.log(req.user.friends);
                }
                req.user.save()
                .then( console.log(`${req.user.email} db updated`))
                .catch(err => {console.log(err);})
             res.redirect('/user/home');
            }
          )
          .catch((err) => console.log(err));
        }
      })
    }

    else{
// MORE THAN 1 FRIEND
      let Amount = 0;
      // Calculating Total Amount
      for (let i = 0; i < amountArr.length; i++) {
          Amount = Amount + parseFloat(amountArr[i]);
      } 
      // Checking if all users exist
      let notpresent = [];
    for (let i = 0; i < friendArr.length; i++) {
     
      await User.findOne({ email : friendArr[i] } , (err , friend) => {
      //  console.log(friend);
        if(err){
          console.log(err);
          res.status(400).render('./error' , {
            PageTitle : "Network error" , 
            path : '/error'
          });
        } 
        else if(!friend){
          // if any one  is not present
          notpresent.push(friendArr[i]);
        }
         // ends 
        });
      }

     if(notpresent.length === 0){
      for (let i = 0; i < friendArr.length; i++) {
        await User.findOne({email : friendArr[i] } , (err , friend ) => {
          if(err){
            console.log(err);
            res.status(400).render('./error' , {
              PageTitle : "Network error" , 
              path : '/error'
            });
          } 
          else if(friend){
            friend.borrowMoney += parseFloat(amountArr[i]);
            friend.save()
            .then(console.log(`${friend.email} db updated`))
            .catch((err) =>{
              console.log(err);
              res.status(400).render('./error' , {
                PageTitle : "Network error" , 
                path : '/error'
              });
            });
            }
           // ends 
          });
        }
        req.user.lendMoney += Amount;
       
        const username = req.user.email;
        const friendname = [];
        friendname.push(...friendArr);
       
        const amount = [];
        amount.push(...amountArr);
        
        const uid = uuid.v4();
        const NewTransfer = new Transfer({username , friendname  , amount  , uid , message , Time });
        NewTransfer.save()
        .then(() => {
          console.log("New Transaction saved");
        })
        .catch((err) => {
          req.flash('error_msg' , "Transaction not Saved");
          console.log(err);
          res.status(400).render('./error' , {
            PageTitle : "Network error" , 
            path : '/error'
          });   
        });

          for(let i=0;i<friendname.length;i++){
            let Exist = false;
            for(let j=0;j<req.user.friends.length;j++){
              if(req.user.friends[j].name.toString() === friendname[i]){
                Exist = true;
                req.user.friends[j].amount += parseFloat(amountArr[i]);
                
              }
            }
            if(!Exist){
              let newfriend = { name : friendname[i] , amount : parseFloat(amount[i]) };
              req.user.friends.push(newfriend);
              
            }
          }
          console.log("friends Array updated ");
          console.log(req.user.friends);
          req.user.save()
          .then(() => console.log("user updated " , req.user) )
          .catch((err) => {
            console.log(err);
            res.status(400).render('./error' , {
              PageTitle : "Network error" , 
              path : '/error'
            });   
          });
        
        res.redirect('/user/home');
     }
     else{
      res.status(404).render('./transfer' , {
        PageTitle : "Transfer" , 
        Error_Msg : "Some Users Not Found" , 
        path : '/user/transfer' , 
        friends : friend , 
        splitamount : splitamount 
      });
     }

    }
}  

exports.getTransactions = async (req,res,next) => {
  const Pagesize = 3;
  const pageNumber =  1;

  const TotalDocs = await Transfer.countDocuments({ $or: [
    { username : req.user.email } , 
    {friendname : req.user.email }
  ] })
  .then(console.log("finding total docs"))
  .catch(err => {
    console.log(err);
    res.status(404).render('./error' , {
      PageTitle : "Transaction error" , 
      error_msg : "Network error" , 
      path : '/error'
    });
  });
  //console.log(TotalDocs);
  // let HasNextPage = true;
  // let HasPreviousPage = false;
  // if(TotalDocs <= pageNumber * Pagesize){
  //   HasNextPage = false;
  // }
  // if(pageNumber > 1){
  //   HasPreviousPage = true;
  // }

  Transfer.find({ $or: [
    { username : req.user.email } , 
    {friendname : req.user.email }
  ] })
  .sort({ Time : -1 })
  .skip((pageNumber-1)*Pagesize)
  .limit(Pagesize)
  .then( ( Transactions ) => {
    //console.log(Transactions);
      res.render('./transaction' , {
        PageTitle : "Transactions" , 
        Transfers : Transactions , 
        path : '/user/transactions'  
        // CurrentPage : pageNumber , 
        // NextPage : pageNumber + 1 
        // PreviousPage : pageNumber-1 , 
        // HasNextPage : HasNextPage , 
        // HasPreviousPage : HasPreviousPage
      });
  })
  .catch((err) => {
    console.log(err); 
    res.status(404).render('./error' , {
      PageTitle : "Transaction error" , 
      error_msg : "Network error" , 
      path : '/error'
    });
  });
}


exports.getFriendTransactions = async (req , res , next ) => {
  const Pagesize = 3;
  const pageNumber = 1;
  const friendId = req.params.FriendId;
  const TotalDocs = await Transfer.countDocuments({ $or : [
    { $and : [ {friendname : friendId } , {username : req.user.email } ] } , 
    { $and : [ { username : friendId } , {friendname : req.user.email } ] }
 ]})
  .then(console.log("finding total docs"))
  .catch(err => {
    console.log(err);
    res.status(404).render('./error' , {
      PageTitle : "Transaction error" , 
      error_msg : "Network error" , 
      path : '/error'
    });
  });
  //console.log(TotalDocs);
  // let HasNextPage = true;
  // let HasPreviousPage = false;
  // if(TotalDocs <= pageNumber * Pagesize){
  //   HasNextPage = false;
  // }
  // if(PageNumber > 1){
  //   HasPreviousPage = true;
  // }
  Transfer.find({ $or : [
    { $and : [ {friendname : friendId } , {username : req.user.email } ] } , 
    { $and : [ { username : friendId } , {friendname : req.user.email } ] }
 ]})
  .sort({Time : -1 })
  .skip((pageNumber-1) * Pagesize)
  .limit(5)
  .then((transfers) =>{
    //console.log(transfers);
    res.render('./transaction' , {
      PageTitle : `${friendId}'s Transactions` , 
      Transfers : transfers , 
      path : "/user/transaction"
      // CurrentPage : pageNumber , 
      // NextPage : pageNumber + 1 , 
      // PreviousPage : pageNumber-1, 
      // HasNextPage : HasNextPage , 
      // HasPreviousPage : HasPreviousPage
    });
   
  })
  .catch((err)=>{
    console.log(err);
    res.status(404).render('./error' , {
      PageTitle : "Transaction error" , 
      error_msg : "Network error" , 
      path : '/error'
    });
  });

}

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


exports.getEditTransaction = (req,res,next) => {
  let uid = req.params.TransferId;

  Transfer.find({ uid : uid } , (err , transfer) => {
    if(err){
      throw err;
    }
    if(!transfer){
      //req.flash('error_msg' ,S 'No transaction found');
      res.redirect('/user/transaction');
    }
    if(transfer){
      // console.log(transfer);
      // console.log("get route ends");
      res.render('./EditTransaction' , {
        PageTitle : "Edit Transfer" , 
        path : "/user/edit-transaction" , 
        Transfers : transfer  , 
        Id : uid
      })
    }
});
}

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