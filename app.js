//Definitions
const express    = require('express'),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

//Fix mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/rave_reviews"); //connect JS to MongoDB
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); //Tells express that /views are ejs files

//Schema setup
const festivalSchema = new mongoose.Schema({
    name: String,
    image: String
});
const Festival = mongoose.model("Festival", festivalSchema);

//Home page
app.get("/", function (req, res) {
    res.render("landing");
});

//Festivals
app.get("/festivals", function (req, res) {
    Festival.find({}, function(err, allFestivals){ //get all the festivals from the DB
        if (err){
            console.log(err);
        } else {
            res.render("festivals", { festivals: allFestivals }); //render the festivals
        }
    });
});

//Create a new festival
app.post("/festivals", function (req, res) { //get data from form and add to festivals array
    let newFestival = {
        name: req.body.festivalName,
        image: req.body.imageUrl
    };
    // Create a new festival and save to DB
    Festival.create(newFestival, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/festivals"); //redirect to /festivals 
        }
    });
});

//Form to add a new festival
app.get("/festivals/new", function (req, res) {
    res.render("new");
});

//Start server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});