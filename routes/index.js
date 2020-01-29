const express  = require("express")
      router   = express.Router(),
      passport = require("passport");

//Models
const User = require("../models/user");

//Home page
router.get("/", function (req, res) {
    res.render("landing");
});

//Registration//

//NEW - Shows form to register new user
router.get("/register", function(req, res){
    res.render("register");
});

//CREATE - Add a new user to the database
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){ //try to add user
        if (err){
            return res.render("register", {"error": err.message}); //if error, reload register page and flash error message (user already created, etc.)
        }
        passport.authenticate("local")(req, res, function(){  //if user creation successful, log user in and bring them to see all festivals
            req.flash("success", "Successfully signed up as " + user.username);
            res.redirect("/festivals");
        });
    });
});

//Login//

//Show login form
router.get("/login", function(req, res){
    res.render("login");
});

//Handling login logic
router.post("/login", passport.authenticate("local", //middleware that authenticates user locally 
    {
        successRedirect: "/festivals", //if successful login, redirect to festivals page
        failureRedirect: "/login",   //if unsuccessful login, reload login page
        failureFlash: true //flashes an error message if unsuccessful login
    }), function(req, res){
});

//Logout//
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out"); //flash logout message upon redirect
    res.redirect("/festivals");
});

module.exports = router;