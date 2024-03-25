module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You need to Logged in to create a Listing ");
       return res.redirect("/login");
    }
    next();
}