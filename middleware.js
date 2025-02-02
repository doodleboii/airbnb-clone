const Listing = require('./models/listing');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = async (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}       

module.exports.isOwner= async(req ,res , next) => {
    let {id} = req.params;
    listing = await Listing.findById(id);
    if(!currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error', 'You do not have permission to edit this listing');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(errMsg, 400);
    }else {
        next();
    }
};

module.exports.isreviewAuthor= async(req ,res , next) => {
    let {id, ReviewId} = req.params;
    let review = await Review.findById(ReviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not the author of this listing');
        return res.redirect(`/listings/${id}`);
    } 
    next();
}