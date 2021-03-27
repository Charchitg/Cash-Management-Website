const User = require('../models/User');
const Transfer = require('../models/Transfer');


exports.getTransferPage = (req,res,next) =>{
    res.render('./transfer' , {
      PageTitle : "Transfer" , 
      Username : username , 
      friends : friend  , 
      path : "/user/transfer"
    });
  }
  
  exports.postTransferPage = async (req,res,next) =>{
    const friendArr = req.body.friend;
    const amountArr = req.body.amount;
    const message = req.body.description;

  
  if( typeof(friendArr) === "string" ){
// ONLY ONE FRIEND LOGIC  

  await User.findOne({ email : friendArr } , ( err , friend ) => {
    if(err){
      console.log("error1");
      console.log(err);
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        Error_Msg : ""
      });
    } 
    else if(!friend){
      console.log("error2");
      console.log('no user found ');
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        Error_Msg : "no user found" , 
        friendname : friendArr
      });
    }
    else{
      console.log("error3");
      const username = req.user.email;
      const friendname = friend.email;
      const amount = parseInt(amountArr);

          req.user.lendMoney += amount;
          req.user.save()
          .then(console.log(`${req.user.email} db updated`))
          .catch((err) => console.log(err));
          friendname.borrowMoney += amount;
          friendname.save()
          .then(console.log(`${friendname.email} db updated`))
          .catch((err) => console.log(err));
          const NewTransfer = new Transfer({username , friendname , amount , message});
          NewTransfer.save()
          .then( console.log('New Transfer Added') )
          .catch((err) => console.log(err));
        }
      })
    }

// Problem lies in the else section
// 


     else{
// MORE THAN 1 FRIEND
      let Amount = 0;
      // Calculating Total Amount
      for (let i = 0; i < amountArr.length; i++) {
          Amount = Amount + parseInt(amountArr[i]);
      } 
      // Checking if all users exist
      var notpresent = [];
    for (let i = 0; i < friendArr.length; i++) {
      // email : friendArr[i]
      await User.findOne({ email : friendArr[i] } , function(err , friend) {
        console.log("vd");
        console.log(friend);
        if(err){
          console.log(err);
          throw err;
        } 
        else if(!friend){
          // if any one  is not present
          console.log(' user not found');
          console.log(friendArr[i]);
          // if here we try and update notpresent array it does not gets updated
          notpresent.push(friendArr[i]);
        }
        else if(friend){
          console.log("user found");
          console.log(friend);
        }
         // ends 
        });
        
        console.log(notpresent);
      }
      console.log("NotPresent "  , notpresent);      
     if(notpresent.length === 0){
      for (let i = 0; i < friendArr.length; i++) {
        User.findOne({email : friendArr[i] } , (err , friend ) => {
          if(err){
            console.log(err);
            throw err;
          } 
          else if(friend){
            friend.borrowMoney += parseInt(amountArr[i]);
            friend.save()
            .then(console.log(`${friend.email} db updated`))
            .catch(err =>{
              console.log('err');
              throw err;
            });
            }
           // ends 
          });
        }
        req.user.lendMoney += Amount;
        console.log(typeof(Amount));
        req.user.save()
        .then(console.log(`${req.user.email} db updated`))
        .catch(err => console.log(err));
        const username = req.user.email;
        const friendname = [];
        friendname.push(...friendArr);
        console.log(friendname);
        const amount = [];
        amount.push(...amountArr);
        console.log(amount);
        const NewTransfer = new Transfer({username , friendname  , amount , message });
        NewTransfer.save()
        .then(() => {
          console.log("New Transaction saved");
          res.redirect('/user/home');
        })
        .catch((err) => {
          console.log(err);
          //req.flash('success_msg' , 'Transaction not saved ');
          res.redirect('/user/tranfer');
        });
     }
     else{
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        Error_Msg : "no user found" , 
        friendname : friendArr
      });
     }
    }
}  

exports.getTransactions = (req,res,next) => {
  Transfer.find({username : req.user.email }).limit(10).sort({Time : -1})
  .then((Transactions)=>{
    console.log(Transactions);
      res.render('./transaction' , {
        PageTitle : "Transactions" , 
        Transfers : Transactions
      })
  })
  .catch(err => console.log(err));
}


exports.getFriendTransactions = (req , res , next ) => {
  const friendId = req.params.FriendId;
  Transfer.find({friendname : friendId }).limit(10).sort({Time : -1 })
  .then((transfers) =>{
    res.render('./transaction' , {
      PageTitle : `${friendId}'s Transactions` , 
      Transfers : transfers
    });
  })
  .catch((err)=>{
    console.log(err);
  });

}

exports.deleteTransaction = (req , res , next ) => {
  const TransferId = req.params.TransferId;
  Transfer.findOneAndDelete({ username : TransferId } , (err , transfer)=>{
    if(err){
      throw err;
    }
    if(!transfer){
      //req.flash('error_msg' , 'No transaction found');
      res.redirect('/user/transaction');
    }
    if(transfer){
        const amount = parseInt(transfer.amount);
        User.findOne({email : username} , (err , user) => {
          if(err){
            throw err ;
          }
          if(user){
            user.lendMoney -= amount;
            user.save()
            .then(console.log('user lend money updated'))
            .catch((err) => {
              console.log(err);
              throw err;
            });
          }
        });
        
        User.findOne({email : friendname } , (err , friend ) => {
          if(err){
            throw err;
          }
          if(friend){
            friend.borrowMoney -= amount;
            friend.save()
            .then(console.log('friend borrow money updated'))
            .catch((err) => {
              console.log(err);
              throw err;
            });
          }
        });
        //req.flash('success_msg' , 'Transaction deleted Successfully ');
        res.redirect('user/transaction');
    }    
  });
}


// exports.getEditTransaction = (req,res,next) =>{
//   const TransferId = req.params.TransferId;
//   Transfer.findOne({ username : TransferId } , (err , transfer)=>{
//     if(err){
//       throw err;
//     }
//     if(!transfer){
//       req.flash('error_msg' , 'No transaction found');
//       res.redirect('/user/transaction');
//     }
//     if(transfer){
      
//       res.render('./transfer' , {
//         PageTitle : "Edit Transfer" , 

//       })
//     }
// });
// }