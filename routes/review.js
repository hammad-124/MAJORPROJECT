const express = require("express");
const router = express.Router({mergeParams: true});


const wrapasync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");


//validate review from server side..............................................
const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
 }


//REVIEW POST..............................................................................
router.post("/",validateReview,isLoggedIn, wrapasync(async (req, res) => {

    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("sucess","newReview Created");

    res.redirect(`/listings/${list._id}`);
    // res.send("Review saved");
}));

//review delete route........................................................................

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull :{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;