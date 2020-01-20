const mongoose = require("mongoose");

//Schema setup
const festivalSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Festival", festivalSchema);