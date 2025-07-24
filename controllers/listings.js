const Listing=require("../models/listings.js");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
           res.render("listings/index.ejs",{allListings});
   };

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){ // user exist krta h?
    //     req.flash("error","You must be logged in to create listing");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
  }

module.exports.createListing=async(req,res,next)=>{
    // let{title,description,image,price,location,country}=req.body;
    //let listing=req.body;
    //console.log(listing);
    // let listing=req.body.listing;
    //   if(!req.body.listing){ // when listing object is not sent i.e no data
    //     throw new ExpressError(400,"Send valid data for listing");
    //   }
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newListing=new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");// write this before redirect ya response
    res.redirect("/listings");
    console.log(newListing);
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
     })
     .populate("owner");
    if(!listing){
        console.log("true");
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }else{
    //console.log(listing);
    res.render("listings/show.ejs",{listing});}
}

module.exports.renderEditForm=async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id);
  if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
  }else{
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs",{listing,originalImageUrl});}
}

module.exports.updateListing=async (req,res)=>{
    // if(!req.body.listing){ // when listing object is not sent i.e no data
    //     throw new ExpressError(400,"Send valid data for listing");
    //   }
    let{id}=req.params;
    console.log(req.body.listing);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   
    if (typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let{id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    //console.log(deletedlisting);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
   }