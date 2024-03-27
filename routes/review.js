const express = require("express");
const router = express.Router({mergeParams: true});


const wrapasync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewControllers = require("../controller/review.js");


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
router.post("/",validateReview,isLoggedIn, wrapasync(reviewControllers.createReview
));

//review delete route........................................................................

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewControllers.deleteReview
));

module.exports = router;