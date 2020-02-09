const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

//Schema set up
const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true}, //would not work if {required: true} was set
    username: {type: String, unique: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false} 
});

userSchema.plugin(passportLocalMongoose); //adds in methods to user for local authentication using mongoose

module.exports = mongoose.model("User", userSchema);