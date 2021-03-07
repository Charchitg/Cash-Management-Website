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
  
  // if the number of friend is one then the type of
  // friendArr is string else it is object 
  // REMEMBER !!!!!!!!!
  // if we apply the same logic for one friend and more than one friend 
  // Eg : 
  // case 1 = Charchit , case 2 = [Charchit , Rajat ]
  // IN case 1 the FriendArr will become [C , h ,a,r,c,h,i,t]
  // whereas in case 2 the FriendArr  remains [Charchit , Rajat ]
  // 
  // same happens with the Amount array so in case 1 if amount is 100 for Charchit 
  //   then amountArr = [1,0,0] therefore for the remaining character in friendArr
  //  the corresponding amount becomes NaN
  //
  
  
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