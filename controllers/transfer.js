const User = require('../models/User');
const Transfer = require('../models/Transfer');
const ObjectId = require('mongodb').ObjectId;
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

  
  if( typeof(friendArr) === "string" ){
// ONLY ONE FRIEND LOGIC  

  await User.findOne({ email : friendArr } , ( err , friend ) => {
    if(err){
          console.log(err);
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        Error_Msg : ""
      });
    } 
    else if(!friend){
      console.log(' User  NOT Found ');
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        Error_Msg : " User Not Found" , 
        friendname : friendArr
      });
    }
    else{
      const username = req.user.email;
      const friendname = friend.email;
      const amount = parseInt(amountArr);

          req.user.lendMoney += amount;
          req.user.save()
          .then(console.log(`${req.user.email} db updated`))
          .catch((err) => console.log(err));
          friend.borrowMoney += amount;
          friend.save()
          .then(console.log(`${friend.email} db updated`))
          .catch((err) => console.log(err));
          const NewTransfer = new Transfer({username , friendname , amount , message});
          NewTransfer.save()
          .then(() =>{ 
              console.log('New Transfer Added');
              
              if(req.user.friends.length === 0){
                req.user.friends.push({name : friend.email , amount });
                console.log(req.user.friends);
                req.user.save()
                .then( console.log("friends array updated "))
                .catch((err) => console.log(err));
              }
              else{
                let Exists = false;
                for(let i=0;i<req.user.friends.length;i++){
                  if(req.user.freinds[i].name === friend.email){
                    Exists = true;
                    req.user.freinds[i].amount += amount;
                    req.user.save()
                    .then( console.log("friends array updated "))
                .catch((err) => console.log(err));
                  }
                }
                if(!Exists){
                  req.user.friends.push({name : friend.email , amount });
                  console.log(req.user.friends);
                  req.user.save()
                  .then( console.log("friends array updated "))
                  .catch((err) => console.log(err));
                }
              }
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
          Amount = Amount + parseInt(amountArr[i]);
      } 
      // Checking if all users exist
      let notpresent = [];
    for (let i = 0; i < friendArr.length; i++) {
     
      await User.findOne({ email : friendArr[i] } , (err , friend) => {
      //  console.log(friend);
        if(err){
          console.log(err);
          throw err;
        } 
        else if(!friend){
          // if any one  is not present
          notpresent.push(friendArr[i]);
        }
         // ends 
        });
      }
      console.log("NotPresent "  , notpresent);      
     if(notpresent.length === 0){
      for (let i = 0; i < friendArr.length; i++) {
        await User.findOne({email : friendArr[i] } , (err , friend ) => {
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
        })
        .catch((err) => {
          console.log(err);
          throw err;   
        });
        if(req.user.friends.length === 0){
          for(let i=0;i<friendname.length;i++){
            req.user.friends.push({name : friendname[i] , amount : amountArr[i]});
          }
          req.user.save()
          .then(console.log("Friends array updated"))
          .catch((err) => console.log(err));
        }
        else{
          for(let i=0;i<friendname.length;i++){
            let Exist = false;
            for(let j=0;j<req.user.friends.length;j++){
              if(req.user.friends[j].name === friendname[i]){
                Exist = true;
                req.user.friends[j].amount += parseFloat(amountArr[i]);
              }
            }
            if(!Exist){
              req.user.friends.push({name : friendname[i] , amount : parseFloat(amountArr[i])});
            }
          }
          console.log("freinds Array updated ");
          console.log(req.user.friends);
        }
        res.redirect('/user/home');
     }
     else{
      res.status(404).render('./error' , {
        PageTitle : "Invalid Users" , 
        Error_Msg : "Some Users Not Found" , 
        path : '/Error' , 
        friendname : friendArr 
      });
     }

    }
}  

exports.getTransactions = (req,res,next) => {
  Transfer.find({username : req.user.email }).limit(5).sort({ Time : -1 })
  .then( ( Transactions ) => {
    console.log(Transactions);
      res.render('./transaction' , {
        PageTitle : "Transactions" , 
        Transfers : Transactions , 
        path : '/user/transactions'
      });
  })
  .catch((err) => {
    console.log(err)
  });
}


exports.getFriendTransactions = (req , res , next ) => {
  const friendId = req.params.FriendId;
  Transfer.find({friendname : friendId }).limit(5).sort({Time : -1 })
  .then((transfers) =>{
    console.log(transfers);
    res.render('./transaction' , {
      PageTitle : `${friendId}'s Transactions` , 
      Transfers : transfers , 
      path : "/user/transaction"
    });
    // res.redirect('/user/home');
  })
  .catch((err)=>{
    console.log(err);
  });

}

exports.deleteTransaction = async (req , res , next ) => {
  const TransferId = req.params.TransferId;
  await Transfer.findOneAndDelete({ _id : TransferId } , (err , transfer)=>{
    if(err){
      throw err;
    }
    else if(!transfer){
      //req.flash('error_msg' , 'No transaction found');
      res.redirect('/user/transaction');
    }
    else if(transfer){
      let amount = 0;
        if(typeof(transfer.amount.length) === number){
           amount = parseFloat(transfer.amount);
        }
        else{ 
          for(let i=0;i<transfer.amount.length ; i++){
            amount += parseFloat(transfer.amount[i]);
          }
        }
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
        if(typeof(friendname) === string){
             User.findOne({email : friendname } , (err , friend ) => {
            if(err){
              throw err;
            }
            if(friend){
              friend.borrowMoney -= amount;
              friend.save()
              .then(() => {
                console.log('friend borrow money updated');
                for(let i=0;i<req.user.friends.length;i++){
                  if(req.user.friends[i].name === friend.email ){
                    req.user.friends[i].amount -= parseFloat(amount);
                    break;
                  }
                }
                req.user.save()
                .then(console.log("Friends array updated "))
                .catch((err) =>{
                  console.log(err);
                  throw err;
                });
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
            }
          });
        }
       else {
        for(let i=0;i<friendname.length ;i++){
           User.findOne( {email : friendname[i]} , (err,friend) =>{
            if(err){
              console.log(err);
              throw err;
            }
            else if(!friend){
              console.log("User Not Found");
            }
            else if(friend){
              friend.borrowMoney -= parseFloat(amount[i]);
              friend.save()
              .then(()=>{
                for(let j = 0;j<req.user.friends.length ;j++){
                  if(req.user.friends[j].name === friend.email){
                    req.user.friends[j].amount -= parseFloat(amount[i]);
                  }
                }
                req.user.save()
                .then(console.log('friend arr updated'))
                .catch((err) =>{
                  console.log(err)
                });
              })
              .catch((err) => {
                console.log(err);
              });
            }
          });
        }
       }
       console.log("FriendArray after deletion ");
       console.log(req.user.freinds);
        //req.flash('success_msg' , 'Transaction deleted Successfully ');
        res.redirect('/user/transaction');
    }    
  });
}


exports.getEditTransaction = (req,res,next) => {
  let Id = req.params.TransferId;
  const TransferId = new ObjectId(Id);
  console.log(TransferId);
  console.log(typeof(TransferId));
  Transfer.find({ _id : TransferId } , (err , transfer) => {
    if(err){
      throw err;
    }
    if(!transfer){
      //req.flash('error_msg' ,S 'No transaction found');
      res.redirect('/user/transaction');
    }
    if(transfer){
      console.log(transfer);
      res.render('./EditTransaction' , {
        PageTitle : "Edit Transfer" , 
        path : "/user/edit-transaction" , 
        Transfers : transfer  , 
        Id : TransferId
      })
    }
});
}

exports.postEditTransaction = (req,res,next) =>{
console.log(req.body);
}