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
          req.user.save()
          .then(console.log(`${req.user.email} db updated`))
          .catch((err) => console.log(err));
          friend.borrowMoney += amount;
          friend.save()
          .then(console.log(`${friend.email} db updated`))
          .catch((err) => console.log(err));
          const uid = uuid.v4();
          const NewTransfer = new Transfer({username , friendname , amount  , uid , message});
          NewTransfer.save()
          .then(() =>{ 
              console.log('New Transfer Added');
              // console.log(req.user.friends);
              // console.log(typeof(req.user.friends));
              const userfriends = Object.keys(req.user.friends);
              // console.log(userfriends);
              // console.log(userfriends.length)
              // console.log(typeof(userfriends));

              if(userfriends){
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
                    req.user.friends[i].amount += amount;
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
      console.log("NotPresent "  , notpresent);      
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
            friend.borrowMoney += parseInt(amountArr[i]);
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
        // req.user.save()
        // .then(console.log(`${req.user.email} db updated`))
        // .catch(err => console.log(err));
        const username = req.user.email;
        const friendname = [];
        friendname.push(...friendArr);
        console.log("friendname" , friendname);
        const amount = [];
        amount.push(...amountArr);
        console.log("Amount " , amount);
        const uid = uuid.v4();
        const NewTransfer = new Transfer({username , friendname  , amount  , uid , message });
        NewTransfer.save()
        .then(() => {
          console.log("New Transaction saved");
        })
        .catch((err) => {
          console.log(err);
          res.status(400).render('./error' , {
            PageTitle : "Network error" , 
            path : '/error'
          });   
        });
        // console.log(req.user.friends)
        // console.log(typeof(req.user.friends))
        const userfriends = Object.keys(req.user.friends);
        // console.log(userfriends);
        // console.log(userfriends.length)
        // console.log(typeof(userfriends));

        if(userfriends){
          for(let i=0;i<friendname.length;i++){
           let newfriend = { name : friendname[i] , amount : parseFloat(amount[i]) };
            req.user.friends.push(newfriend);
            console.log("friend added");
          }
           req.user.save()
          .then(console.log("Friends array updated"))
          .catch((err) => {
            console.log(err);
            res.status(400).render('./error' , {
              PageTitle : "Network error" , 
              path : '/error'
            });   
          });
        }
        else{
          for(let i=0;i<friendname.length;i++){
            let Exist = false;
            for(let j=0;j<req.user.friends.length;j++){
              if(req.user.friends[j].name === friendname[i]){
                Exist = true;
                req.user.friends[j].amount += parseFloat(amountArr[i]);
                console.log("friend added1");
              }
            }
            if(!Exist){
              let newfriend = { name : friendname[i] , amount : parseFloat(amount[i]) };
              req.user.friends.push(newfriend);
              console.log("friend added2");
            }
          }
          console.log("friends Array updated ");
          console.log(req.user.friends);
          req.user.save()
          .then(() => console.log("user updated") )
          .catch((err) => {
            console.log(err);
            res.status(400).render('./error' , {
              PageTitle : "Network error" , 
              path : '/error'
            });   
          });
        }
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
  const pageNumber = parseInt(req.query.PageNumber) || 1;

  const TotalDocs = 0;
  await Transfer.countDocuments({ $or: [
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
  let HasNextPage = true;
  let HasPreviousPage = false;
  if(TotalDocs <= pageNumber * Pagesize){
    HasNextPage = false;
  }
  if(pageNumber > 1){
    HasPreviousPage = true;
  }

  Transfer.find({ $or: [
    { username : req.user.email } , 
    {friendname : req.user.email }
  ] })
  .sort({ Time : -1 })
  .skip((pageNumber-1)*Pagesize)
  .limit(Pagesize)
  .then( ( Transactions ) => {
    console.log(Transactions);
      res.render('./transaction' , {
        PageTitle : "Transactions" , 
        Transfers : Transactions , 
        path : '/user/transactions' , 
        CurrentPage : pageNumber , 
        NextPage : pageNumber + 1 ,
        PreviousPage : pageNumber-1 , 
        HasNextPage : HasNextPage , 
        HasPreviousPage : HasPreviousPage
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
  const pageNumber = parseInt(req.query.PageNumber);
  const friendId = req.params.FriendId;
  const TotalDocs = await Transfer.find({ $or:[
    { friendname : friendId } , 
    {username : friendId }
 ]})
 .countDocuments()
  .then(console.log("finding total docs"))
  .catch(err => {
    console.log(err);
    res.status(404).render('./error' , {
      PageTitle : "Transaction error" , 
      error_msg : "Network error" , 
      path : '/error'
    });
  });
  let HasNextPage = true;
  let HasPreviousPage = false;
  if(TotalDocs <= pageNumber * Pagesize){
    HasNextPage = false;
  }
  if(PageNumber > 1){
    HasPreviousPage = true;
  }
  Transfer.find({ $or:[
      { friendname : friendId } , 
      {username : friendId }
   ]})
  .sort({Time : -1 })
  .skip((pageNumber-1) * Pagesize)
  .limit(5)
  .then((transfers) =>{
    console.log(transfers);
    res.render('./transaction' , {
      PageTitle : `${friendId}'s Transactions` , 
      Transfers : transfers , 
      path : "/user/transaction", 
      CurrentPage : pageNumber , 
      NextPage : pageNumber + 1 , 
      PreviousPage : pageNumber-1, 
      HasNextPage : HasNextPage , 
      HasPreviousPage : HasPreviousPage
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
  
  await Transfer.findOneAndDelete({ uid : uid } , (err , transfer)=>{
    if(err){
      console.log(err);
      res.status(404).render('./error' , {
        PageTitle : "Transaction error" , 
        error_msg : "Network error" , 
        path : '/error'
      });
    }
    else if(!transfer){
      req.flash('error_msg' , 'No transaction found');
      res.redirect('/user/transaction');
    }
    else if(transfer){
      console.log(transfer);
      let amount = 0;
        if(typeof(transfer.amount.length) === "number"){
           amount = parseFloat(transfer.amount);
        }
        else{ 
          for(let i=0;i<transfer.amount.length ; i++){
            amount += parseFloat(transfer.amount[i]);
          }
        }
         User.findOne({email : transfer.username } , (err , user) => {
          if(err){
            console.log(err);
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
        console.log(typeof(transfer.friendname));
        if(typeof(transfer.friendname) === string){
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
  const friendname = req.body.friend;
  const amount = req.body.amount;
  let uid = req.params.TransferId;
  // const TransferId = new ObjectId(Id);
  // console.log(TransferId);
  // console.log(typeof(TransferId));
  Transfer.findOneAndUpdate({ uid : uid } , {friendname : friendname , amount : amount } , (err , transfer) => {
    if(err){
      throw err;
    }
    if(!transfer){
      //req.flash('error_msg' ,S 'No transaction found');
      res.redirect('/user/transaction');
    }
    if(transfer){
      console.log("updating");
      
      res.redirect('/user/transactions');
    }
});
}