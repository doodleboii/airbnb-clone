const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const overide = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main().then(() => {
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true})); // Enables parsing of URL-encoded bodies, allowing us to access form data in req.body
app.use(overide('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

app.get("/", (req, res) => {
    res.send("Hi! I am home route");
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

