const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

//Schema set up
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false} 
});

userSchema.plugin(passportLocalMongoose); //adds in methods to user for local authentication using mongoose

module.exports = mongoose.model("User", userSchema);