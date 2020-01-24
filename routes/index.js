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
            console.log(err);
            return res.render("register"); //if error, reload register page
        }
        passport.authenticate("local")(req, res, function(){  //if user creation successful, log user in and bring them to see all festivals
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
        failureRedirect: "/login"   //if unsuccessful login, reload login page
    }), function(req, res){
});

//Logout//
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/festivals");
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;