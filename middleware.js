const listing = require("./models/listing");
const Review = require("./models/review");

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

//Authorizee for listings.....................................
module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let list =await listing.findById(id);
    if(!list.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","Only owner of this List has permission to this.......!");
        return res.redirect(`/listings/${id}`)
    }
next();
}

//Authorize for Review...........................................
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","Only owner of this Review has permission to this.......!");
        return res.redirect(`/listings/${id}`)
    }
next();
}