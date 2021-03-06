//Models
const Festival = require("../models/festival"),
      Comment  = require("../models/comment");

//Definition of middleware object to hold functions
const middlewareObj = {};

middlewareObj.checkFestivalAuthorization = function (req, res, next) {
    if (req.isAuthenticated()) { //Check if user is logged in
        Festival.findById(req.params.id, function (err, foundFestival) {
            if (err || !foundFestival) {
                req.flash("error", "Festival not found");
                res.redirect("back");
            } else {
                if (foundFestival.author.id.equals(req.user._id) || req.user.isAdmin) { //Check if user is authorized to edit the festival (must be creator), must use .equals() method bc one is string and other is object
                    next(); //executes next code after middleware
                } else {
                    req.flash("error", "You do not have permission to access this");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to access this"); //flashed error message upon redirect
        res.redirect("back"); //redirect to previous page
    }
}

middlewareObj.checkCommentAuthorization = function (req, res, next) {
    if (req.isAuthenticated()) { //Check if user is logged in
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) { //Check if user is authorized to edit the comment (must be creator), must use .equals() method bc one is string and other is object
                    next(); //executes next code after middleware
                } else {
                    req.flash("error", "You do not have permission to access this");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to access this");
        res.redirect("back"); //redirect to previous page
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You must be logged in to access this"); //flashed error message when redirected, does not display unless called in login route
        res.redirect("/login");
    }
}

module.exports = middlewareObj;