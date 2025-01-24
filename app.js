const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const overide = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/listings", async(req, res) => {
      const allListings = await Listing.find({})
      res.render("listings/index.ejs", {allListings});
        
});

 //new route
app.get("/listings/new", async(req, res) => {
    res.render("listings/new.ejs");
})

app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create route
app.post("/listings", async(req, res) => {
    let {title, description, price, image, location, country} = req.body;
    let newListing = new Listing({
        title,
        description,
        price,
        image: { url: image },
        location,
        country
    });
    await newListing.save();
    res.redirect("listings/" + newListing._id);
});
// app.post("/listings", async(req, res) => {
//     let {title, description, price, image, location, country} = req.body;
//     let newListing = new Listing({title, description, price, image, location, country});
//     await newListing.save();
//     res.redirect("listings/" + newListing._id);
// });


// Edit route
app.get('/listings/:id/edit', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render('listings/edit.ejs', { listing });
});

// Update route
app.put('/listings/:id/', async (req, res) => {
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
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating listing');
    }
});

// Delete route
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
