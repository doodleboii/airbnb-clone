const Listing = require('../models/listing');
const Review = require('../models/review');



module.exports.createReview = async (req, res) =>{         //router.post('/listings/:id/reviews', WE WILL REMOVE THE COMMON ROUTE in both routes
                                                           //i.e/listings/:id/  common in both routes
let listing = await Listing.findById(req.params.id);             //let {id} = req.params;     saves one step directly done it here
let newReview = new Review(req.body.review);

newReview.author = req.user._id;

await newReview.save();
listing.reviews.push(newReview._id);

listing.markModified('reviews');

await newReview.save();
await listing.save();
req.flash('success', 'New Review Added!');
res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let {id, review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Review.findById(review_id);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${id}`);
   }