const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, isreviewAuthor} = require("../middleware.js");


//index route
router.get("/", async(req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
      
});

///new route
router.get("/new", isLoggedIn, async(req, res) => {
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path:"author"},})
        .populate('owner');
    if(!listing){
    req.flash('error', 'Listing not found!');
    res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
});

// Create route
router.post("/", isLoggedIn, async(req, res) => {
    let {title, description, price, image, location, country} = req.body;
    let newListing = new Listing({
        title,
        description,
        price,
        image: { url: image },
        location,
        country
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'New Listings Added!');
    res.status(201).redirect(`/listings`);
});
// app.post("/listings", async(req, res) => {
//     let {title, description, price, image, location, country} = req.body;
//     let newListing = new Listing({title, description, price, image, location, country});
//     await newListing.save();
//     res.redirect("listings/" + newListing._id);
// });

 
// Edit route
router.get('/:id/edit', isLoggedIn,isOwner, async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash('error', 'Listing not found!');
        res.redirect('/listings');
        }
    res.render('listings/edit.ejs', { listing });
});

// Update route
router.put('/:id',isLoggedIn, isOwner, async (req, res) => {
    let {id} = req.params;
    try {
        const listing = await Listing.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country,
            'image.url': req.body.image.url
          } );
          req.flash('success', 'Listing Updated!');
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating listing');
    }
});

// Delete route
router.delete('/:id',isLoggedIn,isOwner, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
});

module.exports = router;