const Listing = require("../models/listing.js");

const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index=(async(req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings})
});


module.exports.renderNewForm=( async(req, res) => {
    res.render("listings/new.ejs")
});

module.exports.showListing = async (req, res) => {
    

    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path:"author"},})
        .populate('owner');

 

    if(!listing){
    req.flash('error', 'Listing not found!');
    res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing: listing, coordinates: listing.geometry ? listing.geometry.coordinates : null });

    
}


module.exports.createListing = async(req, res) => {
   let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
})
       .send();
      
        

    
    let url = req.file.path;
    let filename = req.file.filename;

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
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;

    let savedListing  = await newListing.save();

    
    req.flash('success', 'New Listings Added!');
    res.status(201).redirect(`/listings`);
}

module.exports.RenderEditForm =  async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash('error', 'Listing not found!');
        res.redirect('/listings');
        }
    res.render('listings/edit.ejs', { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    try {
        let listing = await Listing.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country,
        });
        

        if (!listing) {
            req.flash('error', 'Listing not found');
            res.redirect('/listings');
            return;
        }

        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;

            listing.image = { url, filename };
            await listing.save();
        }

        req.flash('success', 'Listing Updated!');
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating listing');
    }
}

module.exports.destroyListing =  async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
}