//~~~~~~~~~~~~~~~~~~//
//    Definitions   //
//~~~~~~~~~~~~~~~~~~//
const   express       = require('express'),
        app           = express(),
        bodyParser    = require("body-parser"),
        mongoose      = require("mongoose"),
        passport      = require("passport"),
        localStrategy = require("passport-local");

//Models
const Festival = require("./models/festival"),
      Comment  = require("./models/comment"),
      User     = require("./models/user");

//Routes
const indexRoutes    = require("./routes/index"),
      festivalRoutes = require("./routes/festivals"),
      commentRoutes  = require("./routes/comments");

//Database seed file (comment this out when done testing)
const seedDB = require("./seeds");
seedDB();

//~~~~~~~~~~~~~~~~~~//
//    App Config    //
//~~~~~~~~~~~~~~~~~~//

//Mongoose config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/rave_reviews"); //connect JS to MongoDB

app.use(bodyParser.urlencoded({ extended: true })); //allows express to pull data from forms using req.body._________
app.set("view engine", "ejs"); //Tells express that /views are ejs files
app.use(express.static(__dirname + "/public")); //Link CSS stylesheets to app, __dirname adds directory that folder lives in

//Passport Config
app.use(require("express-session")({
    secret: "I love my kitty", 
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); //sets authentication to local, User.authenticate comes directly from passportLocalMongoose
passport.serializeUser(User.serializeUser()); //comes directly from passportLocalMongoose
passport.deserializeUser(User.deserializeUser()); //comes directly from passportLocalMongoose

//Checks if someone is logged in on each page 
app.use(function(req, res, next){
    res.locals.currentUser = req.user; //check if user
    next(); //do whatever comes next
});

//Tells app to use routes exported from route files
app.use("/", indexRoutes);
app.use("/festivals", festivalRoutes); //adds /festivals as the prefix to every route coming in from festivalRoutes
app.use("/festivals/:id/comments", commentRoutes); 

//~~~~~~~~~~~~~~~~~~//
//   Start Server   //
//~~~~~~~~~~~~~~~~~~//

//Start server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});