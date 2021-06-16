const User = require('../models/User');
const Transfer = require('../models/Transfer');
//const ObjectId = require('mongodb').ObjectId;
const uuid = require('uuid');



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
