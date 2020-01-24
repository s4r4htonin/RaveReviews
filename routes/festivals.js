const express = require("express"),
      router  = express.Router();

//Models
const Festival = require("../models/festival");

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

//CREATE - Add a festival to the database
router.post("/", function (req, res) { //get data from form and add to festivals array
    let newFestival = {
        name: req.body.festivalName,
        image: req.body.imageUrl,
        description: req.body.festivalDescription
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

//NEW - Display form to add a new festival
router.get("/new", function (req, res) {
    res.render("festivals/new");
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

module.exports = router;