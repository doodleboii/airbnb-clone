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
});

// Create a mongoose model for the Listing schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
