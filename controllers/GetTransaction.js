const User = require('../models/User');
const Transfer = require('../models/Transfer');
const uuid = require('uuid');


exports.getTransferPage = (req,res,next) =>{

    res.render('./transfer' , {
      PageTitle : "Transfer" , 
      amount : splitamount , 
      friends : friend  , 
      path : "/user/transfer"
    });
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

