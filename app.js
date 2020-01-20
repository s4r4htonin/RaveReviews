//~~~~~~~~~~~~~~~~~~//
//    Definitions   //
//~~~~~~~~~~~~~~~~~~//
const   express    = require('express'),
        app        = express(),
        bodyParser = require("body-parser"),
        mongoose   = require("mongoose");

//Models
const Festival = require("./models/festival"),
      Comment  = require("./models/comment");

//Database seed file (comment this out when done testing)
const seedDB = require("./seeds");
seedDB();

//~~~~~~~~~~~~~~~~~~//
//    App Config    //
//~~~~~~~~~~~~~~~~~~//

//Fix mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/rave_reviews"); //connect JS to MongoDB
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); //Tells express that /views are ejs files

//~~~~~~~~~~~~~~~~~~//
//      Routes      //
//~~~~~~~~~~~~~~~~~~//

//Home page
app.get("/", function (req, res) {
    res.render("landing");
});

//~~~~~~~~~~~~~~~~~~//
// Festival Routes  //
//~~~~~~~~~~~~~~~~~~//

//INDEX - Show all festivals
app.get("/festivals", function (req, res) {
    Festival.find({}, function (err, allFestivals) { //get all the festivals from the DB
        if (err) {
            console.log(err);
        } else {
            res.render("festivals/index", { festivals: allFestivals }); //render the festivals
        }
    });
});

//CREATE - Add a festival to the database
app.post("/festivals", function (req, res) { //get data from form and add to festivals array
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
app.get("/festivals/new", function (req, res) {
    res.render("festivals/new");
});

//SHOW - Show information about a single festival
app.get("/festivals/:id", function (req, res) {
    Festival.findById(req.params.id).populate("comments").exec(function(err, foundFestival){ //find the festival with the provided ID and populate comments
        if (err){
            console.log(err);
        } else {
            res.render("festivals/show", {festival: foundFestival}); //render show template with that festival
        }
    });
});

//~~~~~~~~~~~~~~~~~~//
//  Comment Routes  //
//~~~~~~~~~~~~~~~~~~//

//NEW - Display form to add a new comment to an existing festival
app.get("/festivals/:id/comments/new", function(req, res){
    Festival.findById(req.params.id, function(err, foundFestival){ //find the festival with the provided ID and 
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {festival: foundFestival});
        }
    });
});

//CREATE - Add a comment to an existing festival
app.post("/festivals/:id/comments", function(req, res){
    Festival.findById(req.params.id, function(err, foundFestival){ //find the festival with the provided ID
        if (err){
            console.log(err);
            res.redirect("/festivals"); //if festival not found, reload index of festivals
        } else {
            Comment.create(req.body.comment, function(err, newComment){ //create a new comment
                if (err){
                    console.log(err);
                    res.redirect("/festivals/:id/comments/new"); //if error creating comment, reload form to add a comment
                } else { 
                    foundFestival.comments.push(newComment); //add the new comment as an association to the festival
                    foundFestival.save(); //save the festival with the new comment
                    res.redirect("/festivals/" + foundFestival._id); //redirect back to the festival
                }
            });
        }
    });
});

//~~~~~~~~~~~~~~~~~~//
//   Start Server   //
//~~~~~~~~~~~~~~~~~~//

//Start server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});