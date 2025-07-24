const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
//const ExpressError=require("../utils/ExpressError.js");
//const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage}); // here multer by default cloudinary ki storage me store krega


// exctracted common part -->  /listings = /

router
  .route("/")
  .get(wrapAsync(listingController.index))  //Index route
  .post(isLoggedIn, upload.single('listing[image]'),validateListing ,wrapAsync(listingController.createListing)); // create route


  //New route
router.get("/new", isLoggedIn , listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))  //Edit and update
    .delete(isLoggedIn, isOwner , wrapAsync(listingController.destroyListing));  //DELETE ROUTE
   
//Edit and Update
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(listingController.renderEditForm));


module.exports=router;