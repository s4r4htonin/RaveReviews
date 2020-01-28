const express = require("express"),
      router  = express.Router();

//Models
const Festival = require("../models/festival"),
      Comment  = require("../models/comment");

//Middleware
const middleware = require("../middleware"); //Check authentication and authorization on required routes

//INDEX - Show all festivals
router.get("/", function (req, res) {
    Festival.find({}, function (err, allFestivals) { //get all the festivals from the DB
        if (err) {
            console.log(err);
        } else {
            res.render("festivals/index", { festivals: allFestivals, currentUser: req.user }); //render the festivals, pass who is logged in to index.ejs
        }
    });
});

//NEW - Display form to add a new festival
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("festivals/new");
});

//CREATE - Add a festival to the database
router.post("/", middleware.isLoggedIn, function (req, res) { //get data from form and add to festivals array
    let newFestival = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id, //associate user with new festival
            username: req.user.username
        }
    };
    // Create a new festival and save to DB
    Festival.create(newFestival, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/festivals"); //redirect to /festivals 
        }
    });
});

//SHOW - Show information about a single festival
router.get("/:id", function (req, res) {
    Festival.findById(req.params.id).populate("comments").exec(function(err, foundFestival){ //find the festival with the provided ID and populate comments
        if (err){
            console.log(err);
        } else {
            res.render("festivals/show", {festival: foundFestival}); //render show template with that festival
        }
    });
});

//EDIT - Show form to edit an existing festival
router.get("/:id/edit", middleware.checkFestivalAuthorization, function (req, res) { //check authorization and load edit form
    Festival.findById(req.params.id, function(err, foundFestival){ //only gets here if user is authorized via middleware function checkAuthorization
        res.render("festivals/edit", {festival: foundFestival}); 
    });
});

//UPDATE - Update an existing festival
router.put("/:id", middleware.checkFestivalAuthorization, function (req, res){
    Festival.findByIdAndUpdate(req.params.id, req.body.festival, function(err, updatedFestival){
        if (err){
            res.redirect("/festivals");
        } else {
            res.redirect("/festivals/" + req.params.id);
        }
    });
});

//DESTROY - Deletes an existing festival
router.delete("/:id", middleware.checkFestivalAuthorization, function (req, res){
    Festival.findByIdAndDelete(req.params.id, function(err, deletedFestival){
        if (err) {
            res.redirect("/festivals");
        } else {
            Comment.deleteMany({_id: { $in: deletedFestival.comments}}, (err) => { //delete all comments associated with the festival from database
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/festivals");
                }
            });
        }
    });
});

module.exports = router;