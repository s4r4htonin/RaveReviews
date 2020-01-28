const express = require("express"),
      router  = express.Router({ mergeParams: true }); //merge params from festivals and comments

//Models
const Festival = require("../models/festival"),
      Comment  = require("../models/comment");

//Middleware
const middleware = require("../middleware"); //Check authentication and authorization on required routes

//NEW - Display form to add a new comment to an existing festival
router.get("/new", middleware.isLoggedIn, function(req, res){
    Festival.findById(req.params.id, function(err, foundFestival){ //find the festival with the provided ID and 
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {festival: foundFestival});
        }
    });
});

//CREATE - Add a comment to an existing festival
router.post("/", middleware.isLoggedIn, function(req, res){
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

//EDIT - Display form to edit a comment
router.get("/:comment_id/edit", middleware.checkCommentAuthorization, function(req, res){ //cannot have two /:ids
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {festival_id: req.params.id, comment: foundComment}); //can easily get id of festival, need to look up comment
        }
    });
});

//UPDATE - Update with edited comment
router.put("/:comment_id", middleware.checkCommentAuthorization, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){ //req.body.comment = comment text from form
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/festivals/" + req.params.id); //redirect to show page for festival
        }
    });
});

//DESTROY - Delete a comment
router.delete("/:comment_id", middleware.checkCommentAuthorization, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment){ //find and delete the comment 
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/festivals/" + req.params.id); //redirect to show page for festival
        }
    });
});

module.exports = router;