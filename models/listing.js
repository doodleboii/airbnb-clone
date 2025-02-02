const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    url: String,
});

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: Number,
    image: {
      type: imageSchema,
      required: true,
      url: String,
    },
    location: String,
    country: String,
    reviews: [
      {
        // we use Schema.Types.ObjectId to refer to the ObjectID type provided by Mongoose
        // this is an efficient way to store the ID of the review document in MongoDB
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    } 
});

  listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing.reviews.length) {
       await Review.deleteMany({ _id: { $in: listing.reviews } });
      
    }
  });

// Create a mongoose model for the Listing schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
