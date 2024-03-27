
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");


module.exports.createReview = async (req, res) => {

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
}


module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull :{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted");

    res.redirect(`/listings/${id}`);
}