const User = require('../models/User');
const Transfer = require('../models/Transfer');


exports.getTransferPage = (req,res,next) =>{
    res.render('./transfer' , {
      PageTitle : "Transfer" , 
      Username : username , 
      friends : friend 
    });
  }
  
  exports.postTransferPage = (req,res,next) =>{
    const friendArr = req.body.friend;
    const amountArr = req.body.amount;
    const message = req.body.description;

  
if( typeof(friendArr) === "string" ){
// ONLY ONE FRIEND LOGIC  

User.findOne({email : friendArr } , (err , friend ) => {
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
        Error_Msg : "no user found"
      });
    }
    else{
      console.log("error3");
      const username = req.user.email;
      const friendname = friend.email;
      const amount = parseInt(amountArr);
      const NewTransfer = new Transfer({ username , friendname , amount , message});
      req.user.lendMoney += amount;
      friend.borrowMoney += amount;
      req.user.save()
      .then(()=>{
        console.log('user db update')
        friend.save()
        .then(()=>{
          console.log('friend db update')
          NewTransfer.save()
          .then(()=> {
            console.log('new transaction added');
            //res.redirect('/user/home');
          }
          )
          .catch((err)=> {
            console.log(err);
            res.status(404).render('./error' , {
              PageTitle : "Transaction error" , 
              Error_Msg : "Transaction not saved "
            })
          }
          );
        })
        .catch(()=>{
          console.log(err);
          res.status(404).render('./error' , {
            PageTitle : "Transaction error" , 
            Error_Msg : "Could not access friend's DB"
          });
        });
      })
      .catch(()=>{
        console.log(err);
        res.status(404).render('./error' , {
          PageTitle : "Transaction error" , 
          Error_Msg : "Could not access User DB"
        });
      });
    }
  });


  }
     else{
// MORE THAN 1 FRIEND
      let Amount = 0;
      for (let i = 0; i < amountArr.length; i++) {
          Amount = Amount + parseInt(amountArr[i]);
      } 
      req.user.lendMoney += Amount;
    for (let i = 0; i < friendArr.length; i++) {
      User.findOne({email : friendArr[i] } , (err , friend ) => {
        if(err){
          console.log(err);
          res.status(404).render('./error' , {
            PageTitle : "Transaction error" , 
            Error_Msg : ""
          });
        } 
        else if(!friend){
          console.log('no user found');
          res.status(404).render('./error' , {
            PageTitle : "Transaction error" , 
            Error_Msg : "no user found"
          });
        }
        else{
          const username = req.user.email;
      const friendname = friend.email;
      const amount = parseInt(amountArr[i]);
          const NewTransfer = new Transfer({username , friendname , amount , message});
          friend.borrowMoney += amount;
            friend.save()
            .then(()=>{
              console.log('friend db update')
              NewTransfer.save()
              .then(()=> {
                console.log('new transaction added');
                //res.redirect('/user/home');
              }
              )
              .catch((err)=> {
                console.log(err);
            res.status(404).render('./error' , {
              PageTitle : "Transaction error" , 
              Error_Msg : "Transaction not saved "
            });
            }
            );
            })
            .catch((err)=>{
              console.log(err);
            res.status(404).render('./error' , {
              PageTitle : "Transaction error" , 
              Error_Msg : "Could not access friend's DB"
            })
            });
          }
        })
      }
      
    }
        
  res.redirect('/user/home');
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
      PageTitle : `{friendId}'s Transactions` , 
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
      req.flash('error_msg' , 'No transaction found');
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
        req.flash('success_msg' , 'Transaction deleted Successfully ');
        res.redirect('user/transaction');
    }    
  });
}


exports.getEditTransaction = (req,res,next) =>{
  const TransferId = req.params.TransferId;
  Transfer.findOne({ username : TransferId } , (err , transfer)=>{
    if(err){
      throw err;
    }
    if(!transfer){
      req.flash('error_msg' , 'No transaction found');
      res.redirect('/user/transaction');
    }
    if(transfer){
      
      res.render('./transfer' , {
        PageTitle : "Edit Transfer" , 

      })
    }
});
}