const Listing = require("../models/listing.js");

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
    res.render("listings/show.ejs", {listing});
}


module.exports.createListing = async(req, res) => {
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
    await newListing.save();
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
}

module.exports.destroyListing =  async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
}