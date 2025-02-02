const express=require("express");
const router=express.Router({mergeParams: true});
const Review = require("../models/review.js");
const listings = require("../routes/listing.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isreviewAuthor} = require("../middleware.js");

//reviews
//post route
     router.post('/', isLoggedIn, async (req, res) =>{         //router.post('/listings/:id/reviews', WE WILL REMOVE THE COMMON ROUTE in both routes
                                                                      //i.e/listings/:id/  common in both routes
    let listing = await Listing.findById(req.params.id);             //let {id} = req.params;     saves one step directly done it here
     let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

     await newReview.save();
     listing.reviews.push(newReview._id);
 
     await newReview.save();
     await listing.save();

     req.flash('success', 'New Review Added!');
     res.redirect(`/listings/${listing._id}`);
 }
 )
 
 //delete review route
 router.delete('/:review_id', isLoggedIn, async (req, res) => {
     let {id, review_id} = req.params;
     await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
     await Review.findById(review_id);
     req.flash('success', 'Review Deleted!');
     res.redirect(`/listings/${id}`);
    });

    module.exports=router;

