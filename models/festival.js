const mongoose = require("mongoose");

//Schema setup
const festivalSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    dates: String,
    website: String,
    createdAt: { type: Date, default: Date.now }, //add creation date for festival
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, //associate user with festival
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, //associate user with comment
            ref: "Comment"
        }
    ] 
});

module.exports = mongoose.model("Festival", festivalSchema);