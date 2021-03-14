module.exports = {
    Authenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        console.log('User Login Required');
        res.redirect('/user/login');
    } , 
    NotAuthenticated : function(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        console.log('User Already logged in');
        res.redirect('/user/home');
    }
}    
