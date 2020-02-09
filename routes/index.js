//~~~~~~~~~~~~~~~~~~//
//    Definitions   //
//~~~~~~~~~~~~~~~~~~//

const express = require("express")
router = express.Router(),
    dotenv = require("dotenv").config(),
    passport = require("passport"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto");

//Models
const User = require("../models/user");

//~~~~~~~~~~~~~~~~~~//
//    Root Route    //
//~~~~~~~~~~~~~~~~~~//

router.get("/", function (req, res) {
    res.render("landing");
});

//~~~~~~~~~~~~~~~~~~~//
//    Registration   //
//~~~~~~~~~~~~~~~~~~~//

//NEW - Shows form to register new user
router.get("/register", function (req, res) {
    res.render("register");
});

//CREATE - Add a new user to the database
router.post("/register", function (req, res) {
    let newUser = new User({ username: req.body.username, email: req.body.email });
    if (req.body.adminCode === "rradmin44") { //if user enters correct admin code, account gets admin properties
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) { //try to add user
        if (err) {
            return res.render("register", { "error": err.message }); //if error, reload register page and flash error message (user already created, etc.)
        }
        passport.authenticate("local")(req, res, function () {  //if user creation successful, log user in and bring them to see all festivals
            req.flash("success", "Successfully signed up as " + user.username);
            res.redirect("/festivals");
        });
    });
});

//~~~~~~~~~~~~~~~~~~//
//      Login       //
//~~~~~~~~~~~~~~~~~~//

//Show login form
router.get("/login", function (req, res) {
    res.render("login");
});

//Handling login logic
router.post("/login", passport.authenticate("local", //middleware that authenticates user locally 
    {
        successRedirect: "/festivals", //if successful login, redirect to festivals page
        failureRedirect: "/login",   //if unsuccessful login, reload login page
        failureFlash: true //flashes an error message if unsuccessful login
    }), function (req, res) {
    });

//~~~~~~~~~~~~~~~~~~//
//      Logout      //
//~~~~~~~~~~~~~~~~~~//

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged out"); //flash logout message upon redirect
    res.redirect("/festivals");
});

//~~~~~~~~~~~~~~~~~~~//
//  Forgot Password  //
//~~~~~~~~~~~~~~~~~~~//

//Show forgot password form
router.get("/forgot", function (req, res) {
    res.render("forgot");
});

//Submits forgot password
router.post('/forgot', function (req, res, next) {
    async.waterfall([

        //generates a random reset token that is sent as part of the url to the user's email
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },

        //finds the user by email address and sets the reset token and token expiration
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) { //find the user by the email address
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; //email to reset password is valid for one hour
                user.save(function (err) { //updates the user in the database with the password reset token
                    done(err, token, user);
                });
            });
        },

        //sends an email to the user with a link (containing the reset token) to reset the password
        function (token, user, done) {
            let smtpTransport = nodemailer.createTransport({ //stores email service being used as variable
                service: 'Gmail',
                auth: {
                    user: 'ravereviews44@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = { //template email that is sent when password reset is requested
                to: user.email,
                from: 'ravereviews44@gmail.com',
                subject: 'RaveReviews Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please click on the following link, or paste this into your browser to complete the process:\n\n
                    http://${req.headers.host}/reset/${token}\n\n
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            smtpTransport.sendMail(mailOptions, function (err) { //sends an email to the user from the default account
                console.log('mail sent');
                req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
                done(err, 'done');
            });
        }

    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

//~~~~~~~~~~~~~~~~~~//
//      Reset       //
//~~~~~~~~~~~~~~~~~~//

//Show reset form when user accesses /reset with token
router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
});

//Set new password for user
router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ravereviews44@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'ravereviews44@gmail.com',
                subject: 'Your password has been changed',
                text: `Hello,\n\n
                    This is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/festivals');
    });
});

module.exports = router;