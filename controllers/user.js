exports.getHome = (req , res , next) => {
    res.render('./home' , {
        PageTitle : "Home"
      });
}

exports.friendsInput = (req , res , next) => {
  console.log(req.body);
      const user = req.body.username;
      const friends = req.body.friends;
      // console.log(user);
      // console.log(friends);
      res.render('./base' , {
        PageTitle : "" ,
        Username : user ,
        friends : friends
      });
}

exports.getfriendsOutput = (req , res , next) => {
  res.render('./display' , {
    PageTitle : "Home"
  });
}

exports.friendsOutput = (req,res,next) =>{
  console.log(req.body);
  res.render('./display');
}