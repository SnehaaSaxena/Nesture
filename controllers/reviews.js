const Listing=require("../models/listings.js")
const Review=require("../models/review.js")

module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    // console.log(listing);
    // console.log(newReview);
    // console.log(req.params.id);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added")
    res.redirect(`/listings/${listing._id}`);
 };

 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});// whenever reviewId matches then it is pull
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};