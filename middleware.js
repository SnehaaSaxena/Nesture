const Listing=require("./models/listings.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


// for server side error
module.exports.validateListing=(req,res,next)=>{
    let { error }=listingSchema.validate(req.body); // we are checking that the listingSchema that we created in joi, is req.body satisfying the conditions/constrainsts that defined in schema
    //console.log(result);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let { error }=reviewSchema.validate(req.body);
    //console.log(result);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req);
    //console.log(req.path,"  ", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor=async (req,res,next)=>{
    let{id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};