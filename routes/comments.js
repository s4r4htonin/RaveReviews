const express = require("express"),
      router  = express.Router({ mergeParams: true }); //merge params from festivals and comments

//Models
const Festival = require("../models/festival"),
      Comment  = require("../models/comment");

//NEW - Display form to add a new comment to an existing festival
router.get("/new", isLoggedIn, function(req, res){
    Festival.findById(req.params.id, function(err, foundFestival){ //find the festival with the provided ID and 
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {festival: foundFestival});
        }
    });
});

//CREATE - Add a comment to an existing festival
router.post("/", isLoggedIn, function(req, res){
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
                    newComment.author.id = req.user._id;//add id to comment
                    newComment.author.username = req.user.username; //add username to comment
                    newComment.save(); //save the new comment
                    foundFestival.comments.push(newComment); //add the new comment as an association to the festival
                    foundFestival.save(); //save the festival with the new comment
                    res.redirect("/festivals/" + foundFestival._id); //redirect back to the festival
                }
            });
        }
    });
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