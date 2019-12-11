//Definitions
const express = require('express');
const app = express();

//Tells express that /views are ejs files
app.set("view engine", "ejs"); 

//Routes
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/festivals", function(req, res){
    let festivals = [
        {name: "Spring Awakening", image: ""}, 
        {name: "Electric Daisy Carnival", image: ""},
        {name: "TomorrowWorld", image: ""},
        {name: "Electric Forest", image: ""}
        {name: "Electric Zoo", image: ""}
    ]; //temporary array to hold festival objects; will eventually be replaced by a database
    res.send(festivals);
});

//Start server
app.listen(3000, function(){
    console.log("Server started on port 3000");
});