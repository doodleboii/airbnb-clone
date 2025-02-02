const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, isreviewAuthor} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


//index route
router.get("/", listingController.index);

///new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router.get("/:id", listingController.showListing);

// Create route
router.post("/", isLoggedIn, listingController.createListing);
                                            // app.post("/listings", async(req, res) => {
                                            //     let {title, description, price, image, location, country} = req.body;
                                            //     let newListing = new Listing({title, description, price, image, location, country});
                                            //     await newListing.save();
                                            //     res.redirect("listings/" + newListing._id);
                                            // });

 
// Edit route
router.get('/:id/edit', isLoggedIn,isOwner, listingController.RenderEditForm);

// Update route
router.put('/:id',isLoggedIn, isOwner, listingController.updateListing);

// Delete route
router.delete('/:id',isLoggedIn,isOwner, listingController.destroyListing);

module.exports = router;