const express=require("express");
const router=express.Router({mergeParams: true});
const Review = require("../models/review.js");
const listings = require("../routes/listing.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isreviewAuthor} = require("../middleware.js");
const listingReview = require("../controllers/review.js");

//reviews
//post route
     router.post('/', isLoggedIn, listingReview.createReview);
 
 //delete review route
 router.delete('/:review_id', isLoggedIn, listingReview.destroyReview);

 module.exports=router;

