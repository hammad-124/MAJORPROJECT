module.exports.isLoggedIn =(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect url saved.....................
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You need to Logged in to create a Listing ");
       return res.redirect("/login");
    }
    next();
};

//passport by default one login middleware got sucess it will automatically reset the
//req.session so we will saved it into locals so passport cant delete it................

module.exports.savedRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}