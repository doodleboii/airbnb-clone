const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post('/signup', async (req, res) => {
    console.log('Received signup request:', req.body);
    try {
        const { username, email, password } = req.body;
        if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
            req.flash("error", "Please provide all required fields");
            res.redirect("/signup");
        }else {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash("error", "Email already in use");
                res.redirect("/signup");
            } else {
                const newUser = new User({ username, email, password });
                const registeredUser = await User.register(newUser, password);
                console.log("Registered user:",registeredUser);
                req.flash("success", "Welcome to Wanderlust!");
                res.redirect('/listings');
            }
        }
    } catch (err) {
        req.flash("error", "Error creating user");
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcome back! You are now logged in");
    res.redirect("/listings");
});
module.exports = router;