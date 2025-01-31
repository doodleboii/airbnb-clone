const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

async function logPopulatedListing() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

    const listing = await Listing.findById("67938f92bb099f6ba11c3f51").populate('reviews'); // Using the valid listing ID
    console.log("Populated Listing Data:", listing);

    mongoose.connection.close();
}

logPopulatedListing();
